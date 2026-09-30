import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { mediaBaseUrl } from "@/lib/supabase/env";
import { getContent } from "./get-content";
import { resolveDictionary } from "./resolve";

/** Словарь одного языка для публичных страниц - из контента в Supabase */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const content = await getContent();
  return resolveDictionary(content, locale, mediaBaseUrl());
}
