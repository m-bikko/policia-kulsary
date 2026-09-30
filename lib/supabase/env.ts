/**
 * Настройки Supabase из переменных окружения. Поддерживаются оба формата ключей:
 * новые (publishable / secret) и старые (anon / service_role) - как их кладёт
 * интеграция Vercel ↔ Supabase.
 */

export const MEDIA_BUCKET = "site-media";
export const CONTENT_TABLE = "site_content";
export const CONTENT_ROW_ID = "main";

export const supabaseUrl = (): string =>
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");

/** Публичный ключ: только чтение контента (RLS разрешает select) */
export const supabasePublicKey = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  "";

/** Серверный ключ: запись контента и загрузка фото. Никогда не уходит в браузер. */
export const supabaseServiceKey = (): string =>
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";

export const isSupabaseConfigured = (): boolean =>
  Boolean(supabaseUrl() && supabasePublicKey() && supabaseServiceKey());

/** База публичных URL фото: .../storage/v1/object/public/site-media */
export const mediaBaseUrl = (): string => {
  const url = supabaseUrl();
  return url ? `${url}/storage/v1/object/public/${MEDIA_BUCKET}` : "";
};
