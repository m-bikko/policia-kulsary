import { coerce } from "@/lib/content/schema-dsl";
import { contentSchema, type Content } from "@/lib/content/schema";
import { defaultContent } from "@/lib/content/default-content";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_ROW_ID, CONTENT_TABLE, isSupabaseConfigured } from "@/lib/supabase/env";

export type EditorData = {
  content: Content;
  /** updated_at строки в базе - для защиты от одновременных правок */
  version: string | null;
  /** false - в базе ещё нет строки, показан эталонный контент */
  seeded: boolean;
};

/** Через сколько часов без пинга редактор начинает предупреждать (пингов 4 в сутки) */
const KEEP_ALIVE_STALE_HOURS = 48;

/**
 * Состояние keep-alive пингов: null - всё в порядке (или не проверить),
 * "never" - пингов ещё не было, число - сколько полных суток назад был последний.
 */
export type KeepAliveStatus = null | "never" | number;

export async function loadKeepAliveStatus(): Promise<KeepAliveStatus> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await createAdminClient()
      .from("heartbeat")
      .select("last_ping_at")
      .order("last_ping_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    const last = data?.[0]?.last_ping_at;
    if (!last) return "never";
    const hours = (Date.now() - new Date(String(last)).getTime()) / 3_600_000;
    return hours >= KEEP_ALIVE_STALE_HOURS ? Math.floor(hours / 24) : null;
  } catch (error) {
    // Миграция 0002 ещё не применена или временная ошибка - не пугаем редактора
    console.error("[edit] failed to load keep-alive status", error);
    return null;
  }
}

/** Свежие (некэшированные) данные для редактора */
export async function loadEditorData(): Promise<EditorData> {
  if (!isSupabaseConfigured()) return { content: defaultContent, version: null, seeded: false };
  try {
    const { data, error } = await createAdminClient()
      .from(CONTENT_TABLE)
      .select("data, updated_at")
      .eq("id", CONTENT_ROW_ID)
      .maybeSingle();
    if (error) throw error;
    if (!data) return { content: defaultContent, version: null, seeded: false };
    return {
      content: coerce(contentSchema, data.data),
      version: String(data.updated_at),
      seeded: true,
    };
  } catch (error) {
    console.error("[edit] failed to load content", error);
    return { content: defaultContent, version: null, seeded: false };
  }
}
