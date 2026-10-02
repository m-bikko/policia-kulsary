import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-init";
import { getPortal, getTemplate } from "@/lib/content/get-content";
import { faviconUrl, mediaUrl } from "@/lib/content/media";
import { mediaBaseUrl } from "@/lib/supabase/env";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [portal, template] = await Promise.all([getPortal(), getTemplate()]);
  const icon = faviconUrl(mediaUrl(template.media.logo, mediaBaseUrl()));
  return {
    title: [portal.splash.title, portal.meta.title.ru, portal.meta.title.en].filter(Boolean).join(" · "),
    description: portal.meta.description.ru || portal.meta.description.kz,
    icons: icon ? { icon } : undefined,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef1f7",
};

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className={fontVariables} suppressHydrationWarning>
      <body className="bg-ceremonial grain min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
