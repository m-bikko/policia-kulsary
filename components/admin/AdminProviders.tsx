"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { App, ConfigProvider } from "antd";
import type { Locale as AntdLocale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import kkKZ from "antd/locale/kk_KZ";
import ruRU from "antd/locale/ru_RU";
import type { Locale } from "@/lib/i18n/config";
import { ADMIN_LANG_COOKIE, adminStrings, type AdminStrings } from "./admin-strings";

type AdminLangValue = {
  lang: Locale;
  strings: AdminStrings;
  setLang: (lang: Locale) => void;
};

const AdminLangContext = createContext<AdminLangValue | null>(null);

/** Язык интерфейса редактора и его надписи */
export function useAdminLang(): AdminLangValue {
  const value = useContext(AdminLangContext);
  if (!value) throw new Error("useAdminLang must be used inside AdminProviders");
  return value;
}

const antdLocales: Record<Locale, AntdLocale> = { kz: kkKZ, ru: ruRU, en: enUS };

/** Тема antd в фирменных цветах сайта: navy + gold (см. app/globals.css) */
const theme = {
  token: {
    colorPrimary: "#96761c",
    colorInfo: "#2b6cb0",
    colorLink: "#85681a",
    colorBgLayout: "#eef1f7",
    colorText: "#101b33",
    colorTextSecondary: "#3f4c6b",
    borderRadius: 10,
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
    fontSize: 15,
  },
  components: {
    Tabs: { itemSelectedColor: "#85681a", inkBarColor: "#96761c", itemHoverColor: "#6d5514" },
  },
};

export default function AdminProviders({
  initialLang,
  children,
}: {
  initialLang: Locale;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Locale>(initialLang);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    document.documentElement.lang = next === "kz" ? "kk" : next;
    document.cookie = `${ADMIN_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo(
    () => ({ lang, strings: adminStrings[lang], setLang }),
    [lang, setLang],
  );

  return (
    <AdminLangContext.Provider value={value}>
      <ConfigProvider theme={theme} locale={antdLocales[lang]}>
        <App>{children}</App>
      </ConfigProvider>
    </AdminLangContext.Provider>
  );
}
