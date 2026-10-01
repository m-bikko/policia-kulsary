import { CONTENT_ROW_ID, CONTENT_TABLE, supabasePublicKey, supabaseUrl } from "./env";

export type KeepAliveSource = "vercel-cron" | "github-actions" | "manual";

export type PingResult =
  | { ok: true; source: KeepAliveSource; pingedAt: string; contentFound: boolean }
  | { ok: false; source: KeepAliveSource; error: string };

const TIMEOUT_MS = 15_000;

/**
 * Держит бесплатный проект Supabase активным: делает запись (rpc keep_alive)
 * и чтение (site_content) - Supabase считает активностью именно запросы к БД.
 * Использует публичный ключ: функция keep_alive разрешена для anon.
 */
export async function pingDatabase(source: KeepAliveSource): Promise<PingResult> {
  const url = supabaseUrl();
  const key = supabasePublicKey();
  if (!url || !key) return { ok: false, source, error: "supabase_not_configured" };

  const headers = { apikey: key, "Content-Type": "application/json", Accept: "application/json" };

  try {
    const rpc = await fetch(`${url}/rest/v1/rpc/keep_alive`, {
      method: "POST",
      headers,
      body: JSON.stringify({ p_source: source }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!rpc.ok) return { ok: false, source, error: `rpc_${rpc.status}` };
    const pingedAt: unknown = await rpc.json();

    const read = await fetch(
      `${url}/rest/v1/${CONTENT_TABLE}?id=eq.${CONTENT_ROW_ID}&select=id`,
      { headers, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    if (!read.ok) return { ok: false, source, error: `read_${read.status}` };
    const rows: unknown = await read.json();

    return {
      ok: true,
      source,
      pingedAt: typeof pingedAt === "string" ? pingedAt : new Date().toISOString(),
      contentFound: Array.isArray(rows) && rows.length > 0,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    return { ok: false, source, error: `request_failed_${reason}` };
  }
}
