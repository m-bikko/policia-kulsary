import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
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
  themeColor: "#050b1a",
};

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className={fontVariables}>
      <body className="bg-ceremonial grain min-h-dvh">{children}</body>
    </html>
  );
}
