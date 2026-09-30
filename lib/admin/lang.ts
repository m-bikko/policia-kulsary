import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { ADMIN_LANG_COOKIE } from "@/components/admin/admin-strings";

/** Язык интерфейса редактора (cookie), по умолчанию - русский */
export async function getAdminLang(): Promise<Locale> {
  const value = (await cookies()).get(ADMIN_LANG_COOKIE)?.value ?? "";
  return isLocale(value) ? value : "ru";
}
