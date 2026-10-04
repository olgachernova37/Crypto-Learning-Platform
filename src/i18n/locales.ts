// Supported interface + lesson languages. English is the source; the others are translations.
export const LOCALES = ["en", "uk", "cs", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Each language named in itself (that's how people look for their language in a switcher). */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  cs: "Čeština",
  ru: "Русский",
};
export const LOCALE_SHORT: Record<Locale, string> = { en: "EN", uk: "UA", cs: "CZ", ru: "RU" };

/** Language names in English, for telling the AI guide which language to answer in. */
export const LOCALE_ENGLISH_NAMES: Record<Locale, string> = {
  en: "English",
  uk: "Ukrainian",
  cs: "Czech",
  ru: "Russian",
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);
