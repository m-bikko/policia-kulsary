import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-init";
import "../globals.css";

export const metadata: Metadata = {
  title:
    "Жылыой ауданы полиция басқармасы · Управление полиции Жылыойского района · Zhylyoi Police",
  description:
    "Управление полиции Жылыойского района, Атырауская область. Экстренный вызов - 102. Тілді таңдаңыз · Выберите язык · Choose your language.",
  icons: { icon: "/images/logo-mvd-sm.png" },
};

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
