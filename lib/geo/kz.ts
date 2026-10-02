import type { Locale } from "@/lib/i18n/config";
import mapData from "./kz-map.json";

/**
 * Административная карта Казахстана: 20 регионов (17 областей + Астана, Алматы,
 * Шымкент) и их районы/города. Собирается скриптом scripts/geo/build-map.mjs
 * из OpenStreetMap; пути уже спроецированы в SVG-координаты viewBox.
 */

export type GeoNames = Record<Locale, string>;

type GeoShape = {
  slug: string;
  city: boolean;
  name: GeoNames;
  /** SVG path в координатах viewBox */
  path: string;
  /** [x0, y0, x1, y1] */
  bbox: number[];
  center: number[];
};

export type GeoRegion = GeoShape & { code: string };
export type GeoDistrict = GeoShape & { region: string; osmId: number };

export type KzMap = {
  attribution: string;
  viewBox: number[];
  regions: GeoRegion[];
  districts: GeoDistrict[];
};

export const kzMap: KzMap = mapData;

export type SiteKind = "region" | "district";

/** Лендинг на карте: регион (id = 'atyrau') или район (id = 'atyrau/zhylyoi') */
export type GeoSite =
  | { kind: "region"; id: string; region: GeoRegion }
  | { kind: "district"; id: string; region: GeoRegion; district: GeoDistrict };

const regionsBySlug = new Map(kzMap.regions.map((region) => [region.slug, region]));
const districtsById = new Map(kzMap.districts.map((district) => [`${district.region}/${district.slug}`, district]));

export const getRegion = (slug: string): GeoRegion | undefined => regionsBySlug.get(slug);

export const districtsOf = (regionSlug: string): GeoDistrict[] =>
  kzMap.districts.filter((district) => district.region === regionSlug);

export const districtSiteId = (district: GeoDistrict): string => `${district.region}/${district.slug}`;

/** Находит лендинг по id; неизвестный id (не из карты) - undefined */
export function getGeoSite(id: string): GeoSite | undefined {
  const district = districtsById.get(id);
  if (district) {
    const region = regionsBySlug.get(district.region);
    return region ? { kind: "district", id, region, district } : undefined;
  }
  const region = regionsBySlug.get(id);
  return region ? { kind: "region", id, region } : undefined;
}

/** Все лендинги карты: сначала регионы, затем районы */
export function allGeoSites(): GeoSite[] {
  const sites: GeoSite[] = kzMap.regions.map((region) => ({ kind: "region", id: region.slug, region }));
  for (const district of kzMap.districts) {
    const region = regionsBySlug.get(district.region);
    if (region) sites.push({ kind: "district", id: districtSiteId(district), region, district });
  }
  return sites;
}

/** Географическое название лендинга: район или регион */
export const geoSiteName = (site: GeoSite): GeoNames =>
  site.kind === "district" ? site.district.name : site.region.name;

/** Публичный адрес лендинга на нужном языке */
export const sitePath = (locale: Locale, id: string): string => `/${locale}/${id}`;
