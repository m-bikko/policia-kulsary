import { getGeoSite } from "@/lib/geo/kz";

/** Документы редактора: общий шаблон, портал и лендинги карты */
export type DocKind = "template" | "portal" | "region" | "district";
export type SiteStatus = "draft" | "published";

/** Строка документа в списке (без данных) */
export type DocRow = { id: string; kind: DocKind; status: SiteStatus; updatedAt: string };

export const TEMPLATE_ID = "template";
export const PORTAL_ID = "portal";

/** Тип документа по id; null - такого документа быть не может (не из карты) */
export function docKind(id: string): DocKind | null {
  if (id === TEMPLATE_ID) return "template";
  if (id === PORTAL_ID) return "portal";
  return getGeoSite(id)?.kind ?? null;
}

export const isSiteKind = (kind: DocKind): kind is "region" | "district" => kind === "region" || kind === "district";

export const isSiteStatus = (value: unknown): value is SiteStatus => value === "draft" || value === "published";

/** Адрес редактора документа */
export const editorPath = (id: string): string => `/edit/${id}`;
