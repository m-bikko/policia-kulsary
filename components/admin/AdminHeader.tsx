"use client";

import type { ReactNode } from "react";
import { Button, Segmented, Tooltip, Typography } from "antd";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(admin)/edit/actions";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { useAdminLang } from "./AdminProviders";

/** Верхняя панель редактора: заголовок (или навигация), язык интерфейса, выход */
export default function AdminHeader({ children, actions }: { children?: ReactNode; actions?: ReactNode }) {
  const { strings: a, lang, setLang } = useAdminLang();
  return (
    <header className="sticky top-0 z-20 border-b border-navy-700 bg-navy-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="mr-auto min-w-0">
          {children ?? (
            <Typography.Title level={5} style={{ margin: 0 }}>
              {a.appTitle}
            </Typography.Title>
          )}
        </div>
        {actions}
        <Tooltip title={a.interfaceLanguage}>
          <Segmented<Locale>
            size="small"
            value={lang}
            onChange={setLang}
            options={locales.map((l) => ({ value: l, label: localeLabels[l].code }))}
          />
        </Tooltip>
        <form action={logoutAction}>
          <Button htmlType="submit" type="text" icon={<LogOut size={15} aria-hidden />}>
            {a.logout}
          </Button>
        </form>
      </div>
    </header>
  );
}
