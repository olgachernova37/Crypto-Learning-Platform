// The UI dictionary for a language (falls back to English per key). No "use client":
// server code (e.g. the share-card image) uses it too.
import { en, type Dict } from "./ui/en";
import { de } from "./ui/de";
import { uk } from "./ui/uk";
import { cs } from "./ui/cs";
import { ru } from "./ui/ru";
import type { Locale } from "./locales";
import type { DeepPartial } from "./types";

const PARTIALS: Record<Locale, DeepPartial<Dict>> = { en, de, uk, cs, ru };

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
