// Supported interface + lesson languages. English is the source; the others are translations.
// Order = order in the language switcher.
export const LOCALES = ["en", "de", "cs", "ru", "uk"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Each language named in itself (that's how people look for their language in a switcher). */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  uk: "Українська",
  cs: "Čeština",
  ru: "Русский",
};
export const LOCALE_SHORT: Record<Locale, string> = { en: "EN", de: "DE", cs: "CZ", ru: "RU", uk: "UA" };

/** Language names in English, for telling the AI guide which language to answer in. */
export const LOCALE_ENGLISH_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  uk: "Ukrainian",
  cs: "Czech",
  ru: "Russian",
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);
