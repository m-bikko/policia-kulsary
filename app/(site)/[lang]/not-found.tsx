import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { localeLabels, locales } from "@/lib/i18n/config";
import { getPortal, getTemplate } from "@/lib/content/get-content";
import { mediaUrl } from "@/lib/content/media";
import { mediaBaseUrl } from "@/lib/supabase/env";

/**
 * Лендинг не найден или ещё черновик. Язык адреса здесь неизвестен,
 * поэтому текст показывается на трёх языках, а кнопки ведут на портал с картой.
 */
export default async function SiteNotFound() {
  const [portal, template] = await Promise.all([getPortal(), getTemplate()]);
  const logo = mediaUrl(template.media.logo, mediaBaseUrl());
  const { notFound, allRegions } = portal.directory;
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <div className="rounded-full border border-gold-500/50 p-1.5">
        {logo ? (
          <Image src={logo} alt="" width={88} height={88} priority className="rounded-full" />
        ) : (
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-navy-800 text-gold-400">
            <ShieldCheck className="h-9 w-9" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-6 font-display text-5xl font-bold text-gold-400">404</p>
      <ul className="mt-4 flex flex-col gap-1 text-sm text-ink-soft">
        {locales.map((locale) => (
          <li key={locale} lang={locale === "kz" ? "kk" : locale}>
            {notFound[locale]}
          </li>
        ))}
      </ul>
      <nav className="mt-8 flex w-full flex-col gap-2.5">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={`/${locale}`}
            lang={locale === "kz" ? "kk" : locale}
            className="card-official flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 text-sm font-semibold text-ink"
          >
            <span>{allRegions[locale]}</span>
            <span className="text-[11px] font-bold tracking-widest text-gold-500">{localeLabels[locale].code}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
