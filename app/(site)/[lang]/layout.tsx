import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-init";
import { locales, htmlLang, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/content/get-dictionary";
import { faviconUrl } from "@/lib/content/media";
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
  const dict = await getDictionary(lang);
  const icon = faviconUrl(dict.media.logo);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
