"use client";

// useT(): the UI dictionary in the learner's language (falls back to English per key).
import { useMemo } from "react";
import { en, type Dict } from "./ui/en";
import { uk } from "./ui/uk";
import { cs } from "./ui/cs";
import { ru } from "./ui/ru";
import type { Locale } from "./locales";
import type { DeepPartial } from "./types";
import { useLocale } from "./store";

const PARTIALS: Record<Locale, DeepPartial<Dict>> = { en, uk, cs, ru };

function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (typeof base !== "object" || base === null || Array.isArray(base)) return over as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = merge(out[k], v);
  return out as T;
}

const cache = new Map<Locale, Dict>();
export function dictFor(locale: Locale): Dict {
  let d = cache.get(locale);
  if (!d) cache.set(locale, (d = locale === "en" ? en : merge(en, PARTIALS[locale])));
  return d;
}

export function useT(): Dict {
  const [locale] = useLocale();
  return useMemo(() => dictFor(locale), [locale]);
}

export { useLocale, setLocale } from "./store";
export { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from "./locales";
