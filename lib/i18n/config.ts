export const locales = ["kz", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "kz";

/** Значение атрибута lang для <html> (ISO 639-1) */
export const htmlLang: Record<Locale, string> = {
  kz: "kk",
  ru: "ru",
  en: "en",
};

export const localeLabels: Record<Locale, { code: string; name: string }> = {
  kz: { code: "QAZ", name: "Қазақша" },
  ru: { code: "RUS", name: "Русский" },
  en: { code: "ENG", name: "English" },
};

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
