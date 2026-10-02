import Link from "next/link";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

/**
 * Переключатель языка: та же страница на другом языке.
 * path - путь без языка ('' для портала, 'atyrau/zhylyoi' для лендинга), hash - якорь портала.
 */
export default function LangSwitcher({
  current,
  path,
  hash,
  hrefs,
}: {
  current: Locale;
  path: string;
  hash?: string | null;
  /** Свои адреса для языков (предпросмотр в редакторе) */
  hrefs?: Record<Locale, string>;
}) {
  return (
    <nav
      aria-label="Language"
      className="flex items-center gap-1 rounded-full border border-gold-500/20 bg-navy-900/70 p-1"
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefs?.[locale] ?? `/${locale}${path ? `/${path}` : ""}${hash ? `#${hash}` : ""}`}
          lang={locale === "kz" ? "kk" : locale}
          aria-current={locale === current ? "page" : undefined}
          className={`flex min-h-11 items-center rounded-full px-4 text-[11px] font-bold tracking-widest transition-colors ${
            locale === current ? "bg-gold-solid text-on-gold" : "text-ink-soft hover:text-gold-300"
          }`}
        >
          {localeLabels[locale].code}
        </Link>
      ))}
    </nav>
  );
}
