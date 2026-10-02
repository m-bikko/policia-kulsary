import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_TABLE, isSupabaseConfigured } from "@/lib/supabase/env";
import { docKind, isSiteStatus, type DocKind, type DocRow, type SiteStatus } from "./documents";

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

/** Все документы (без данных) - для карты и списков; null - база недоступна */
export async function loadDocRows(): Promise<DocRow[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await createAdminClient()
      .from(CONTENT_TABLE)
      .select("id, kind, status, updated_at");
    if (error) throw error;
    return (data ?? []).flatMap((row): DocRow[] => {
      const id = String(row.id);
      const kind = docKind(id);
      // Устаревшие строки (прежняя 'main') в редакторе не показываем
      if (!kind || kind !== row.kind) return [];
      return [{ id, kind, status: isSiteStatus(row.status) ? row.status : "draft", updatedAt: String(row.updated_at) }];
    });
  } catch (error) {
    console.error("[edit] failed to load documents", error);
    return null;
  }
}

export type LoadedDoc = {
  kind: DocKind;
  /** Сырые данные (приводятся к схеме на клиенте и при сохранении) */
  data: unknown;
  /** updated_at - для защиты от одновременных правок; null - строки ещё нет */
  version: string | null;
  status: SiteStatus;
};

/** Свежие (некэшированные) данные одного документа; null - id не из карты */
export async function loadDoc(id: string): Promise<LoadedDoc | null> {
  const kind = docKind(id);
  if (!kind) return null;
  const empty: LoadedDoc = { kind, data: {}, version: null, status: "draft" };
  if (!isSupabaseConfigured()) return empty;
  const { data, error } = await createAdminClient()
    .from(CONTENT_TABLE)
    .select("data, status, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return empty;
  return {
    kind,
    data: data.data,
    version: String(data.updated_at),
    status: isSiteStatus(data.status) ? data.status : "draft",
  };
}
