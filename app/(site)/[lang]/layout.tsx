import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-init";
import { locales, htmlLang, isLocale, type Locale } from "@/lib/i18n";
import { getPortal, getTemplate } from "@/lib/content/get-content";
import { faviconUrl, mediaUrl } from "@/lib/content/media";
import { pickLocale } from "@/lib/content/resolve";
import { mediaBaseUrl } from "@/lib/supabase/env";
import "../../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  // Значения по умолчанию (портал); лендинги переопределяют их в своих page.tsx
  const [portal, template] = await Promise.all([getPortal(), getTemplate()]);
  const icon = faviconUrl(mediaUrl(template.media.logo, mediaBaseUrl()));
  return {
    title: pickLocale(portal.meta.title, lang),
    description: pickLocale(portal.meta.description, lang),
    icons: icon ? { icon } : undefined,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef1f7",
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={htmlLang[lang as Locale]}
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="bg-ceremonial grain min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
