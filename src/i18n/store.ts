"use client";

// The learner's language, kept in localStorage. First visit: the browser's language if we have it.
// The server always renders English; the client switches right after hydration.

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./locales";

const KEY = "crypto-voyage-locale";
const listeners = new Set<() => void>();
let current: Locale | null = null;

function detect(): Locale {
  try {
    const saved = localStorage.getItem(KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const base = l.toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }
  return DEFAULT_LOCALE;
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};
const getSnapshot = (): Locale => (current ??= detect());
const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

export function setLocale(l: Locale) {
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* storage blocked: still switch for this visit */
  }
  document.documentElement.lang = l;
  listeners.forEach((cb) => cb());
}

export function useLocale(): [Locale, (l: Locale) => void] {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return [locale, useCallback((l: Locale) => setLocale(l), [])];
}
