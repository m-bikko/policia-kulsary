/**
 * Скачивает границы Казахстана из OpenStreetMap:
 *  - списки отношений с названиями kk/ru/en - через Overpass API (только теги, лёгкие запросы):
 *    20 регионов (admin_level=4) и районы/города (admin_level=6);
 *  - геометрию каждого отношения - через polygons.openstreetmap.fr (готовые полигоны OSM).
 *    Запросы геометрии через Overpass публичные серверы часто не успевают отдать (504).
 * Всё кэшируется в scripts/geo/.cache/ - повторный запуск докачивает только недостающее.
 *
 *   node scripts/geo/fetch-osm.mjs
 *
 * Данные © участники OpenStreetMap, лицензия ODbL.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const CACHE = join(process.cwd(), "scripts", "geo", ".cache");
const OVERPASS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const POLYGONS = "https://polygons.openstreetmap.fr";
/** Упрощение на стороне сервиса (~100-400 м) - меньше пикселя на карте всей страны */
const POLYGON_PARAMS = "0.004000-0.001000-0.001000";
const UA = "jylyoi-police-geo/1.0 (+https://github.com/m-bikko/policia-kulsary)";
const CONCURRENCY = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exists = (path) => access(path).then(() => true, () => false);

async function overpass(query, label) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const endpoint = OVERPASS[(attempt - 1) % OVERPASS.length];
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "User-Agent": UA, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(180_000),
      });
      const text = await response.text();
      if (response.ok && text.trimStart().startsWith("{")) return JSON.parse(text);
      console.warn(`  ${label}: ${new URL(endpoint).host} -> ${response.status}, retry ${attempt}`);
    } catch (error) {
      console.warn(`  ${label}: ${error instanceof Error ? error.message : error}, retry ${attempt}`);
    }
    await sleep(Math.min(10_000 * attempt, 60_000));
  }
  throw new Error(`Overpass failed: ${label}`);
}

async function cachedJson(file, load) {
  const path = join(CACHE, file);
  if (await exists(path)) return JSON.parse(await readFile(path, "utf8"));
  const data = await load();
  await writeFile(path, JSON.stringify(data));
  return data;
}

/** Полигон отношения; если сервис ещё не строил его - просим построить и ждём */
async function polygon(id) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(`${POLYGONS}/get_geojson.py?id=${id}&params=${POLYGON_PARAMS}`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(90_000),
      });
      const text = await response.text();
      if (response.ok && text.trimStart().startsWith("{")) return JSON.parse(text);
      // Полигон не сгенерирован - запускаем генерацию
      await fetch(`${POLYGONS}/index.py?id=${id}`, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(90_000) });
    } catch (error) {
      console.warn(`  polygon ${id}: ${error instanceof Error ? error.message : error}, retry ${attempt}`);
    }
    await sleep(3_000 * attempt);
  }
  throw new Error(`polygon ${id} failed`);
}

await mkdir(CACHE, { recursive: true });
const AREA = 'area["ISO3166-1"="KZ"][admin_level=2]->.kz;';

const regions = (
  await cachedJson("regions-tags.json", () =>
    overpass(`[out:json][timeout:120];${AREA}rel(area.kz)["boundary"="administrative"]["admin_level"="4"];out tags;`, "regions"),
  )
).elements;
const districts = (
  await cachedJson("districts-tags.json", () =>
    overpass(`[out:json][timeout:120];${AREA}rel(area.kz)["boundary"="administrative"]["admin_level"="6"];out tags;`, "districts"),
  )
).elements;
console.log(`regions: ${regions.length}, districts: ${districts.length}`);

const ids = [...regions, ...districts].map((element) => element.id);
let done = 0;
let next = 0;
async function worker() {
  while (next < ids.length) {
    const id = ids[next];
    next += 1;
    await cachedJson(`poly-${id}.json`, () => polygon(id));
    done += 1;
    if (done % 20 === 0 || done === ids.length) console.log(`  polygons: ${done}/${ids.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log("done");
