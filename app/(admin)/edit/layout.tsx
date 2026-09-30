import type { Metadata, Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { fontVariables } from "@/lib/fonts";
import { htmlLang } from "@/lib/i18n/config";
import { getAdminLang } from "@/lib/admin/lang";
import AdminProviders from "@/components/admin/AdminProviders";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Редактор · Jylyoi Police",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef1f7",
};

/** Отдельный корневой layout редактора: antd + язык интерфейса из cookie */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();
  return (
    <html lang={htmlLang[lang]} className={fontVariables}>
      <body className="min-h-dvh bg-navy-950">
        <AntdRegistry>
          <AdminProviders initialLang={lang}>{children}</AdminProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
