import { districtSiteId, kzMap, type GeoNames } from "@/lib/geo/kz";

/** Поиск без учёта регистра и казахских букв: «кулсары» находит «Құлсары» */
const KAZAKH_BASE: Record<string, string> = {
  ә: "а",
  ғ: "г",
  қ: "к",
  ң: "н",
  ө: "о",
  ұ: "у",
  ү: "у",
  һ: "х",
  і: "и",
};

export const normalizeSearch = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[әғқңөұүһі]/g, (letter) => KAZAKH_BASE[letter] ?? letter)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export type GeoSearchItem = { kind: "region" | "district"; id: string; region: string; name: GeoNames; haystack: string };

/** Индекс поиска по названиям областей и районов на всех трёх языках */
export const geoSearchIndex: GeoSearchItem[] = [
  ...kzMap.regions.map((region) => ({ kind: "region" as const, id: region.slug, region: region.slug, name: region.name })),
  ...kzMap.districts.map((district) => ({
    kind: "district" as const,
    id: districtSiteId(district),
    region: district.region,
    name: district.name,
  })),
].map((item) => ({ ...item, haystack: normalizeSearch(Object.values(item.name).join(" ")) }));

/** Совпадения по запросу (пустой запрос - пусто) */
export function searchGeo(query: string, limit = 40): GeoSearchItem[] {
  const needle = normalizeSearch(query);
  return needle ? geoSearchIndex.filter((item) => item.haystack.includes(needle)).slice(0, limit) : [];
}
