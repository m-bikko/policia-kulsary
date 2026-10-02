import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { mediaBaseUrl } from "@/lib/supabase/env";
import { getSiteContent, getTemplate } from "./get-content";
import { inheritFromTemplate } from "./inherit";
import { resolveDictionary } from "./resolve";

/**
 * Словарь одного языка для лендинга: поля лендинга поверх общего шаблона.
 * null - лендинг не опубликован (черновик) или не существует.
 */
export async function getSiteDictionary(siteId: string, locale: Locale): Promise<Dictionary | null> {
  const [template, site] = await Promise.all([getTemplate(), getSiteContent(siteId)]);
  if (!site) return null;
  return resolveDictionary(inheritFromTemplate(template, site), locale, mediaBaseUrl());
}
