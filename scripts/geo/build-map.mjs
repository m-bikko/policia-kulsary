/**
 * Собирает карту Казахстана для сайта из кэша OSM (scripts/geo/fetch-osm.mjs):
 *  - определяет область каждого района (по точкам его границы внутри полигонов областей);
 *  - упрощает границы с общей топологией (у соседних районов общая линия, без щелей);
 *  - проецирует в равновеликую коническую проекцию и превращает в готовые SVG-пути;
 *  - присваивает районам область и стабильные slug-и для URL.
 * Результат: lib/geo/kz-map.json - в браузер уходит готовый SVG, без картографических библиотек.
 *
 *   node scripts/geo/build-map.mjs
 *
 * Данные © участники OpenStreetMap, лицензия ODbL.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import mapshaper from "mapshaper";
import { geoConicEqualArea, geoPath, geoContains, geoCentroid, geoArea } from "d3-geo";

const CACHE = join(process.cwd(), "scripts", "geo", ".cache");
const OUT = join(process.cwd(), "lib", "geo", "kz-map.json");
const WIDTH = 1000;
const SIMPLIFY = "4%";

/** Стабильные slug-и регионов (ключ - ISO 3166-2) */
const REGION_SLUGS = {
  "KZ-10": "abai",
  "KZ-11": "akmola",
  "KZ-15": "aktobe",
  "KZ-19": "almaty-region",
  "KZ-23": "atyrau",
  "KZ-27": "west-kazakhstan",
  "KZ-31": "zhambyl",
  "KZ-33": "zhetisu",
  "KZ-35": "karaganda",
  "KZ-39": "kostanay",
  "KZ-43": "kyzylorda",
  "KZ-47": "mangystau",
  "KZ-55": "pavlodar",
  "KZ-59": "north-kazakhstan",
  "KZ-61": "turkistan",
  "KZ-62": "ulytau",
  "KZ-63": "east-kazakhstan",
  "KZ-71": "astana",
  "KZ-75": "almaty",
  "KZ-79": "shymkent",
};

/** Города республиканского значения - на карте подписываются иначе */
const CITY_REGIONS = new Set(["KZ-71", "KZ-75", "KZ-79"]);

const CYRILLIC = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", қ: "k", л: "l", м: "m", н: "n", ң: "n", о: "o", ө: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u", ф: "f", х: "kh", һ: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "shch", ъ: "", ы: "y", і: "i", ь: "", э: "e", ю: "yu", я: "ya",
};

const LATIN_EXTRA = { ı: "i", ş: "sh", ç: "ch", ğ: "g", ŋ: "ng", ə: "a" };

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[ışçğŋə]/g, (char) => LATIN_EXTRA[char])
    .split("")
    .map((char) => CYRILLIC[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Служебные слова в названиях районов и городов (kk/ru), не нужные в адресе */
const ADMIN_WORDS =
  /(қалалық әкімдігі|қалалық әкімшілігі|қаласының әкімшілігі|қ\.ә\.?|ауданы|аудан|қаласы|городская администрация|г\.а\.?|район|город|г\.)/giu;

/** Slug района: транслитерация казахского названия без служебных слов («Жылыой ауданы» -> zhylyoi) */
function districtSlug(tags) {
  const source = tags["name:kk"] || tags["name:ru"] || tags.name;
  return slugify(source.replace(ADMIN_WORDS, " ")) || slugify(tags["name:en"] || source);
}

/* ── Названия ─────────────────────────────────────────────
 * В OSM названия неоднородны: «Семей Г.А.», «Ақтөбе Қ.Ә.», английские - то в новой
 * казахской латинице («Şortandı district»), то с опечатками. Приводим к единому виду:
 * районы - «Жылыой ауданы» / «Жылыойский район» / «Zhylyoi District»,
 * города - «Атырау қаласы» / «город Атырау» / «Atyrau City». */

const zeroWidth = /[\u200b-\u200d\ufeff]/g;
const tidy = (value) => value.replace(zeroWidth, "").replace(/\s+/g, " ").trim();

const KK_ADMIN = /(қалалық әкімдігі|қалалық әкімшілігі|қаласының әкімшілігі|қ\.\s?ә\.?|ауданы|қаласы)/giu;
const RU_ADMIN = /(городская администрация|г\.\s?а\.?|^город\s|^г\.\s|район)/giu;
/** Русские названия городов в OSM, записанные прилагательным или в родительном падеже */
const RU_CITY_FIX = {
  Карагандинская: "Караганда",
  Костанайская: "Костанай",
  Кызылординская: "Кызылорда",
  Петропавловская: "Петропавловск",
  Риддера: "Риддер",
};
/** Принятые английские названия областей, где OSM даёт казахскую латиницу */
const REGION_EN = {
  "KZ-10": "Abai Region",
  "KZ-15": "Aktobe Region",
  "KZ-31": "Zhambyl Region",
  "KZ-33": "Zhetisu Region",
};

/** Латиница для английских названий: «Бұқар жырау» -> «Bukar Zhyrau» */
const romanize = (value) =>
  value
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC[char] ?? char)
    .join("")
    .replace(/(^|[\s-])([a-z])/g, (_, gap, letter) => gap + letter.toUpperCase());

const kkName = (tags) => tidy(tags["name:kk"] || tags.name || tags["name:ru"]);
const ruName = (tags) => tidy(tags["name:ru"] || tags.name);

/** Город: явные признаки в названии или нет слова «аудан/район» (Алатау, Қонаев) */
const isCityTags = (tags) =>
  /городская администрация|г\.\s?а\.|^город |^г\. /iu.test(tags["name:ru"] || "") ||
  /\bcity\b/i.test(tags["name:en"] || "") ||
  /қаласы|қалалық|қ\.\s?ә\./iu.test(tags["name:kk"] || "");
const isCityDistrict = (tags) => isCityTags(tags) || (!/аудан/iu.test(kkName(tags)) && !/район/iu.test(ruName(tags)));

function districtNames(tags, city) {
  const kkBase = tidy(kkName(tags).replace(KK_ADMIN, " "));
  const latin = romanize(kkBase);
  if (!city) return { kz: kkName(tags), ru: ruName(tags), en: `${latin} District` };
  const ruBase = tidy(ruName(tags).replace(RU_ADMIN, " "));
  return { kz: `${kkBase} қаласы`, ru: `город ${RU_CITY_FIX[ruBase] ?? ruBase}`, en: `${latin} City` };
}

const regionNames = (tags, code) => ({
  kz: kkName(tags),
  ru: ruName(tags),
  en: REGION_EN[code] ?? tidy(tags["name:en"] || tags["int_name"] || ruName(tags)),
});

/**
 * d3-geo работает на сфере и требует внешние кольца по часовой стрелке, дыры - против.
 * GeoJSON-источники и mapshaper отдают обратный порядок (RFC 7946), из-за чего d3 видит
 * «весь мир минус район». Нормализуем по площади кольца: внешнее < полусферы, дыра > полусферы.
 */
const HEMISPHERE = 2 * Math.PI;
const ringArea = (ring) => geoArea({ type: "Polygon", coordinates: [ring] });
const rewindPolygon = (rings) =>
  rings.map((ring, index) => {
    const outer = index === 0;
    const small = ringArea(ring) < HEMISPHERE;
    return outer === small ? ring : ring.slice().reverse();
  });
function rewind(feature) {
  const { geometry } = feature;
  if (geometry.type === "Polygon") {
    return { ...feature, geometry: { ...geometry, coordinates: rewindPolygon(geometry.coordinates) } };
  }
  if (geometry.type === "MultiPolygon") {
    return { ...feature, geometry: { ...geometry, coordinates: geometry.coordinates.map(rewindPolygon) } };
  }
  return feature;
}
const rewindAll = (collection) => ({ ...collection, features: collection.features.map(rewind) });

/* ── 1. Чтение кэша ────────────────────────────────────────── */

const readCache = async (name) => JSON.parse(await readFile(join(CACHE, name), "utf8"));
const cacheFiles = new Set(await readdir(CACHE));

/** GeoJSON-фича из скачанного полигона (сервис отдаёт голую геометрию) */
async function featureOf(element) {
  const file = `poly-${element.id}.json`;
  if (!cacheFiles.has(file)) throw new Error(`Нет ${file} - сначала node scripts/geo/fetch-osm.mjs`);
  let geometry = await readCache(file);
  if (geometry.type === "GeometryCollection") {
    const polygons = geometry.geometries.flatMap((g) =>
      g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [],
    );
    geometry = { type: "MultiPolygon", coordinates: polygons };
  }
  return rewind({ type: "Feature", geometry, properties: { osmId: element.id }, tags: element.tags });
}

const regionFeatures = [];
for (const element of (await readCache("regions-tags.json")).elements) {
  const feature = await featureOf(element);
  feature.properties.code = element.tags["ISO3166-2"];
  regionFeatures.push(feature);
}
const districtFeatures = [];
for (const element of (await readCache("districts-tags.json")).elements) {
  districtFeatures.push(await featureOf(element));
}
const regionTags = new Map(regionFeatures.map((feature) => [feature.properties.code, feature.tags]));
console.log(`regions: ${regionFeatures.length}, districts: ${districtFeatures.length}`);

/* ── 2. Принадлежность районов областям ────────────────────── */

/** Точки проверки: центр + до 40 вершин внешней границы, чуть смещённые к центру */
function samplePoints(feature) {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const ring = polygons.reduce((best, polygon) => (polygon[0].length > best.length ? polygon[0] : best), []);
  const center = geoCentroid(feature);
  const step = Math.max(1, Math.floor(ring.length / 40));
  const inward = ([x, y]) => [x + (center[0] - x) * 0.05, y + (center[1] - y) * 0.05];
  return [center, ...ring.filter((_, index) => index % step === 0).map(inward)];
}

// Район относится к самому маленькому региону, где лежит >= 60% его точек. У части
// областей в OSM нет «дырок» под города республиканского значения (Астана внутри
// Акмолинской и т.п.), поэтому «у кого больше точек» отдавало бы районы Астаны области.
const regionsBySize = [...regionFeatures].sort((a, b) => geoArea(a) - geoArea(b));
for (const district of districtFeatures) {
  const points = samplePoints(district);
  const share = (region) => points.filter((point) => geoContains(region, point)).length / points.length;
  let best = regionsBySize.find((region) => share(region) >= 0.6);
  if (!best) {
    best = regionsBySize.reduce((top, region) => (share(region) > share(top) ? region : top));
    console.warn(`  ! неуверенная привязка: ${district.tags["name:ru"]} -> ${best.properties.code}`);
  }
  district.properties.region = best.properties.code;
}
const assignedDistricts = districtFeatures.filter((district) => district.properties.region);

/* ── 3. Упрощение с общей топологией + контуры областей ────── */

const strip = (features) => ({
  type: "FeatureCollection",
  features: features.map(({ type, geometry, properties }) => ({ type, geometry, properties })),
});

const simplified = await mapshaper.applyCommands(
  `-i districts.json snap -simplify ${SIMPLIFY} keep-shapes planar -clean overlap-rule=min-area ` +
    `-dissolve region + name=regions -o format=geojson target=*`,
  { "districts.json": strip(assignedDistricts) },
);
const districtsOut = rewindAll(JSON.parse(simplified["districts.json"]));
const regionsOut = rewindAll(JSON.parse(simplified["regions.json"]));

/* ── 4. Проекция и SVG-пути ────────────────────────────────── */

const projection = geoConicEqualArea().parallels([44, 52]).rotate([-67, 0]).fitWidth(WIDTH, regionsOut);
const path = geoPath(projection).digits(1);
const [[, y0], [, y1]] = path.bounds(regionsOut);
const height = Math.ceil(y1 - y0 + 2);
projection.fitSize([WIDTH, height], regionsOut);

const round = (n) => Math.round(n * 10) / 10;
const shape = (feature) => {
  const [[bx0, by0], [bx1, by1]] = path.bounds(feature);
  const [cx, cy] = path.centroid(feature);
  return { path: path(feature), bbox: [bx0, by0, bx1, by1].map(round), center: [round(cx), round(cy)] };
};

const tagsByOsmId = new Map(assignedDistricts.map((feature) => [feature.properties.osmId, feature.tags]));

const regions = regionsOut.features
  .map((feature) => {
    const code = feature.properties.region;
    const tags = regionTags.get(code);
    return { code, slug: REGION_SLUGS[code], city: CITY_REGIONS.has(code), name: regionNames(tags, code), ...shape(feature) };
  })
  .sort((a, b) => a.name.ru.localeCompare(b.name.ru, "ru"));

// Slug-и: город с тем же названием, что у района или области, получает суффикс -city
// (Костанай: район kostanai и город kostanai-city); прочие совпадения - номер
const baseSlugs = new Map(
  districtsOut.features.map((feature) => [feature.properties.osmId, districtSlug(tagsByOsmId.get(feature.properties.osmId))]),
);
const usedSlugs = new Set();
const districts = districtsOut.features
  .map((feature) => {
    const { osmId, region } = feature.properties;
    const tags = tagsByOsmId.get(osmId);
    const regionSlug = REGION_SLUGS[region];
    const city = isCityTags(tags);
    let slug = baseSlugs.get(osmId);
    const clash = districtsOut.features.some(
      (other) =>
        other.properties.osmId !== osmId &&
        other.properties.region === region &&
        baseSlugs.get(other.properties.osmId) === slug,
    );
    if (city && (slug === regionSlug || clash)) slug = `${slug}-city`;
    let unique = slug;
    for (let n = 2; usedSlugs.has(`${regionSlug}/${unique}`); n += 1) unique = `${slug}-${n}`;
    usedSlugs.add(`${regionSlug}/${unique}`);
    // Признак города для slug не меняем (адреса стабильны), для названия - расширенный
    const cityName = isCityDistrict(tags);
    return { slug: unique, region: regionSlug, osmId, city: cityName, name: districtNames(tags, cityName), ...shape(feature) };
  })
  .sort((a, b) => a.region.localeCompare(b.region) || a.name.ru.localeCompare(b.name.ru, "ru"));

const missing = Object.entries(REGION_SLUGS).filter(([code]) => !regions.some((r) => r.code === code));
if (missing.length) console.warn(`  ! нет регионов: ${missing.map(([c]) => c).join(", ")}`);

await mkdir(join(process.cwd(), "lib", "geo"), { recursive: true });
const output = {
  attribution: "© OpenStreetMap contributors, ODbL",
  generatedAt: new Date().toISOString().slice(0, 10),
  viewBox: [0, 0, WIDTH, height],
  regions,
  districts,
};
const json = JSON.stringify(output);
await writeFile(OUT, json + "\n");
console.log(`regions: ${regions.length}, districts: ${districts.length}, size: ${Math.round(json.length / 1024)} KB -> ${OUT}`);
