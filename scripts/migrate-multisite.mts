/**
 * Переход с одного сайта на много лендингов (идемпотентно, можно запускать повторно):
 *  1. Общий шаблон + лендинг Жылыоя: если в базе есть прежняя строка 'main', она делится на
 *     общий шаблон и собственные поля Жылыоя (lib/content/split.ts) - правки из /edit не теряются.
 *     На чистой базе берутся файлы lib/content/seed/*.json.
 *  2. Портал (главная с картой) - из lib/content/seed/portal.json, если его ещё нет.
 *  3. Черновики лендингов для всех регионов и районов карты (lib/geo/kz-map.json):
 *     заполняется только географическое название, остальное наследуется из шаблона.
 *  --export-seed - после миграции сохранить шаблон и Жылыой из базы в lib/content/seed/
 *  (запасной контент на случай недоступности Supabase).
 *  --sync-names=<старый kz-map.json> - после пересборки карты (pnpm geo:build) обновить
 *  географические названия в черновиках; поля, которые уже правили в /edit, не трогаются.
 *
 *   pnpm db:content [--export-seed] [--sync-names=/path/to/old-kz-map.json]
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { coerce, emptyValue } from "@/lib/content/schema-dsl";
import { contentSchema, type Content } from "@/lib/content/schema";
import { portalSchema } from "@/lib/content/portal-schema";
import { inheritFromTemplate } from "@/lib/content/inherit";
import { splitSiteContent } from "@/lib/content/split";
import { setIn } from "@/lib/admin/set-in";
import { allGeoSites, geoSiteName, type GeoNames, type GeoSite, type KzMap } from "@/lib/geo/kz";
import { isRecord } from "@/lib/content/schema-dsl";
import { locales } from "@/lib/i18n/config";

const ZHYLYOI_ID = "atyrau/zhylyoi";
const SEED_DIR = join(process.cwd(), "lib", "content", "seed");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Нужны NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const readJson = async (name: string): Promise<unknown> =>
  JSON.parse(await readFile(join(SEED_DIR, name), "utf8"));

type Row = { id: string; kind: string; status: string; data: unknown };

async function insert(rows: Row[]): Promise<void> {
  for (let index = 0; index < rows.length; index += 100) {
    const { error } = await supabase.from("site_content").insert(rows.slice(index, index + 100));
    if (error) throw new Error(`insert failed: ${error.message}`);
  }
}

/** Черновик: только географическое название (и область - для района) */
function draftContent(site: GeoSite): Content {
  let content = emptyValue(contentSchema);
  content = setIn(content, "header.name", geoSiteName(site));
  if (site.kind === "district") content = setIn(content, "header.department", site.region.name);
  return content;
}

const { data: existingRows, error: listError } = await supabase.from("site_content").select("id, data");
if (listError) {
  console.error("Не удалось прочитать site_content (pnpm db:migrate выполнен?):", listError.message);
  process.exit(1);
}
const existing = new Map((existingRows ?? []).map((row) => [String(row.id), row.data as unknown]));
const toInsert: Row[] = [];

// 1. Шаблон и Жылыой
if (!existing.has("template")) {
  const additions = coerce(contentSchema, await readJson("template-additions.json"));
  let template: Content;
  let zhylyoi: Content;
  if (existing.has("main")) {
    const split = splitSiteContent(coerce(contentSchema, existing.get("main")));
    template = inheritFromTemplate(additions, split.template);
    zhylyoi = split.site;
    console.log("Шаблон и Жылыой получены из текущей строки 'main'");
  } else {
    template = coerce(contentSchema, await readJson("template.json"));
    zhylyoi = coerce(contentSchema, await readJson("zhylyoi.json"));
    console.log("Шаблон и Жылыой взяты из lib/content/seed");
  }
  toInsert.push({ id: "template", kind: "template", status: "published", data: template });
  if (!existing.has(ZHYLYOI_ID)) {
    toInsert.push({ id: ZHYLYOI_ID, kind: "district", status: "published", data: zhylyoi });
    existing.set(ZHYLYOI_ID, zhylyoi);
  }
}

// 2. Портал
if (!existing.has("portal")) {
  toInsert.push({ id: "portal", kind: "portal", status: "published", data: coerce(portalSchema, await readJson("portal.json")) });
}

// 3. Черновики всех регионов и районов
let drafts = 0;
for (const site of allGeoSites()) {
  if (existing.has(site.id) || toInsert.some((row) => row.id === site.id)) continue;
  toInsert.push({ id: site.id, kind: site.kind, status: "draft", data: draftContent(site) });
  drafts += 1;
}

await insert(toInsert);
console.log(`Добавлено строк: ${toInsert.length} (черновиков: ${drafts})`);

// 4. Экспорт запасного контента
if (process.argv.includes("--export-seed")) {
  const { data, error } = await supabase.from("site_content").select("id, data").in("id", ["template", ZHYLYOI_ID]);
  if (error) throw new Error(error.message);
  for (const row of data ?? []) {
    const file = row.id === "template" ? "template.json" : "zhylyoi.json";
    await writeFile(join(SEED_DIR, file), JSON.stringify(coerce(contentSchema, row.data), null, 2) + "\n");
    console.log(`Сохранено: lib/content/seed/${file}`);
  }
}

// 5. Обновление названий в черновиках после пересборки карты
const syncArg = process.argv.find((arg) => arg.startsWith("--sync-names="));
if (syncArg) {
  const previous = JSON.parse(await readFile(syncArg.slice("--sync-names=".length), "utf8")) as KzMap;
  const oldNames = new Map<string, GeoNames>([
    ...previous.regions.map((region): [string, GeoNames] => [region.slug, region.name]),
    ...previous.districts.map((district): [string, GeoNames] => [`${district.region}/${district.slug}`, district.name]),
  ]);
  const { data: draftRows, error } = await supabase.from("site_content").select("id, data").eq("status", "draft");
  if (error) throw new Error(error.message);

  /** Заменяет язык, только если там всё ещё старое автоматическое название */
  const refresh = (value: unknown, before: GeoNames | undefined, after: GeoNames): GeoNames | null => {
    if (!before || !isRecord(value)) return null;
    let changed = false;
    const next = { ...after };
    for (const locale of locales) {
      const current = typeof value[locale] === "string" ? String(value[locale]) : "";
      if (current === before[locale] && current !== after[locale]) changed = true;
      else next[locale] = current;
    }
    return changed ? next : null;
  };

  let updated = 0;
  for (const row of draftRows ?? []) {
    const site = allGeoSites().find((item) => item.id === row.id);
    if (!site || !isRecord(row.data) || !isRecord(row.data.header)) continue;
    const header = row.data.header;
    let data = coerce(contentSchema, row.data);
    const name = refresh(header.name, oldNames.get(site.id), geoSiteName(site));
    if (name) data = setIn(data, "header.name", name);
    const department =
      site.kind === "district" ? refresh(header.department, oldNames.get(site.region.slug), site.region.name) : null;
    if (department) data = setIn(data, "header.department", department);
    if (!name && !department) continue;
    const { error: updateError } = await supabase.from("site_content").update({ data }).eq("id", site.id);
    if (updateError) throw new Error(`update ${site.id}: ${updateError.message}`);
    updated += 1;
  }
  console.log(`Названия обновлены в черновиках: ${updated}`);
}
