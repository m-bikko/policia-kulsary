import { coerce, isRecord } from "./schema-dsl";
import { contentSchema, type Content } from "./schema";
import { defaultContent } from "./default-content";
import {
  CONTENT_ROW_ID,
  CONTENT_TABLE,
  supabasePublicKey,
  supabaseUrl,
} from "@/lib/supabase/env";

/** Тег кэша: сохранение в /edit вызывает updateTag(CONTENT_TAG) - сайт обновляется сразу */
export const CONTENT_TAG = "site-content";

/**
 * Контент для публичных страниц. Запрос кэшируется Next.js по тегу, поэтому
 * страницы остаются статическими и перегенерируются только после сохранения
 * в редакторе (плюс страховочное обновление раз в час).
 * При недоступности Supabase отдаётся эталонный контент - сайт не падает.
 */
export async function getContent(): Promise<Content> {
  const url = supabaseUrl();
  const key = supabasePublicKey();
  if (!url || !key) return defaultContent;

  try {
    const response = await fetch(
      `${url}/rest/v1/${CONTENT_TABLE}?id=eq.${CONTENT_ROW_ID}&select=data`,
      {
        headers: { apikey: key, Accept: "application/json" },
        cache: "force-cache",
        next: { tags: [CONTENT_TAG], revalidate: 3600 },
      },
    );
    if (!response.ok) {
      console.error(`[content] Supabase responded ${response.status}`);
      return defaultContent;
    }
    const rows: unknown = await response.json();
    const row = Array.isArray(rows) ? rows[0] : undefined;
    if (!isRecord(row)) return defaultContent;
    return coerce(contentSchema, row.data);
  } catch (error) {
    console.error("[content] Supabase request failed", error);
    return defaultContent;
  }
}
