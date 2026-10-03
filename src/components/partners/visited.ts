"use client";

// Which partners the learner has visited from our Partners page (each gives +20 XP once).
// Kept in its own localStorage key, separate from the shared progress store.

import { useCallback, useMemo, useSyncExternalStore } from "react";

export const PARTNERS_KEY = "crypto-voyage-partners-v1";
const EVENT = "crypto-voyage-partners";

function readRaw(): string | null {
  try {
    return localStorage.getItem(PARTNERS_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Forget visited partners (used when the learner resets progress). */
export function clearVisitedPartners() {
  try {
    localStorage.removeItem(PARTNERS_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Returns visited partner ids (empty on the server / first render) and a marker function. */
export function useVisitedPartners() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const visited = useMemo(() => parse(raw), [raw]);

  /** Mark a partner visited. Returns true the first time only. */
  const markVisited = useCallback((id: string) => {
    const current = parse(readRaw());
    if (current.includes(id)) return false;
    try {
      localStorage.setItem(PARTNERS_KEY, JSON.stringify([...current, id]));
    } catch {
      /* private mode: still count it for this session */
    }
    window.dispatchEvent(new Event(EVENT));
    return true;
  }, []);

  return { visited, markVisited };
}
