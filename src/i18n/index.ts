"use client";

// useT(): the UI dictionary in the learner's language (falls back to English per key).
import { useMemo } from "react";
import type { Dict } from "./ui/en";
import { dictFor } from "./dict";
import { useLocale } from "./store";

export function useT(): Dict {
  const [locale] = useLocale();
  return useMemo(() => dictFor(locale), [locale]);
}

export { useLocale, setLocale } from "./store";
export { dictFor } from "./dict";
export { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from "./locales";
