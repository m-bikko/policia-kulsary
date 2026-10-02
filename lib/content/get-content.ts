import { coerce, isRecord } from "./schema-dsl";
import { contentSchema, type Content } from "./schema";
import { portalSchema, type PortalContent } from "./portal-schema";
import { CONTENT_TABLE, supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";
import seedTemplate from "./seed/template.json";
import seedZhylyoi from "./seed/zhylyoi.json";
import seedPortal from "./seed/portal.json";

/** Тег кэша: сохранение в /edit вызывает updateTag(CONTENT_TAG) - сайт обновляется сразу */
export const CONTENT_TAG = "site-content";

/**
 * Запасной контент на случай, если Supabase недоступен или не настроен:
 * сайт не падает, а показывает последнюю выгруженную копию (pnpm db:content --export-seed).
 */
const fallback = {
  template: coerce(contentSchema, seedTemplate),
  portal: coerce(portalSchema, seedPortal),
  sites: new Map<string, Content>([["atyrau/zhylyoi", coerce(contentSchema, seedZhylyoi)]]),
};

type Rows = Record<string, unknown>[];

/**
 * Запрос к PostgREST публичным ключом (RLS отдаёт только шаблон, портал и опубликованные
 * лендинги). Кэшируется Next.js по тегу: страницы статические и перегенерируются после
 * сохранения в редакторе (плюс страховочное обновление раз в час). null - Supabase недоступен.
 */
async function query(params: string): Promise<Rows | null> {
  const url = supabaseUrl();
  const key = supabasePublicKey();
  if (!url || !key) return null;
  try {
    const response = await fetch(`${url}/rest/v1/${CONTENT_TABLE}?${params}`, {
      headers: { apikey: key, Accept: "application/json" },
      cache: "force-cache",
      next: { tags: [CONTENT_TAG], revalidate: 3600 },
    });
    if (!response.ok) {
      console.error(`[content] Supabase responded ${response.status}`);
      return null;
    }
    const rows: unknown = await response.json();
    return Array.isArray(rows) ? rows.filter(isRecord) : null;
  } catch (error) {
    console.error("[content] Supabase request failed", error);
    return null;
  }
}

const byId = (id: string): string => `id=eq.${encodeURIComponent(id)}&select=data`;

/** Общий шаблон: подписи и общенациональные тексты для всех лендингов */
export async function getTemplate(): Promise<Content> {
  const rows = await query(byId("template"));
  const row = rows?.[0];
  return row ? coerce(contentSchema, row.data) : fallback.template;
}

/** Портал: главная страница и каталог с картой */
export async function getPortal(): Promise<PortalContent> {
  const rows = await query(byId("portal"));
  const row = rows?.[0];
  return row ? coerce(portalSchema, row.data) : fallback.portal;
}

/** Собственные поля опубликованного лендинга; null - черновик или такого нет */
export async function getSiteContent(id: string): Promise<Content | null> {
  const rows = await query(byId(id));
  if (rows === null) return fallback.sites.get(id) ?? null;
  const row = rows[0];
  return row ? coerce(contentSchema, row.data) : null;
}

/** id всех опубликованных лендингов (для карты и списков) */
export async function getPublishedSiteIds(): Promise<Set<string>> {
  const rows = await query("kind=in.(region,district)&status=eq.published&select=id");
  if (rows === null) return new Set(fallback.sites.keys());
  return new Set(rows.map((row) => String(row.id)));
}
