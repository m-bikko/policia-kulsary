import { emptyValue, isRecord, type ObjectNode, type SchemaNode } from "./schema-dsl";
import { contentSchema, type Content } from "./schema";
import { setIn } from "@/lib/admin/set-in";

/**
 * Поля, которые у каждого лендинга свои (адреса, телефоны, люди, фото, ссылки).
 * Всё остальное - общий шаблон: подписи кнопок, заголовки разделов, общенациональные
 * тексты (приём на службу, системы отслеживания). Используется при переходе
 * с одного сайта на много и подсказывает редактору, что принадлежит лендингу.
 */
export const SITE_FIELDS = [
  "media.heroBackground",
  "meta.title",
  "meta.description",
  "header.name",
  "header.department",
  "header.location",
  "emergency.dutyPhone",
  "emergency.chief.name",
  "emergency.chief.phone",
  "emergency.addressValue",
  "stats.items",
  "info.paragraphs",
  "info.wikipedia",
  "info.wikipediaUrl",
  "info.govPortal",
  "info.govPortalUrl",
  "points.subtitle",
  "points.headquarters",
  "points.groups",
  "recruitment.subtitle",
  "recruitment.benefits",
  "recruitment.contactAddress",
  "recruitment.contactPhone",
  "units.items",
  "roadSafety.body",
  "video.subtitle",
  "video.watchLabel",
  "video.url",
  "social.subtitle",
  "social.instagram",
  "social.facebook",
  "social.tiktok",
  "footer.org",
] as const;

function nodeAt(path: string): SchemaNode {
  let node: SchemaNode = contentSchema;
  for (const key of path.split(".")) {
    if (node.kind !== "object" || !(key in node.fields)) throw new Error(`Unknown content path: ${path}`);
    node = node.fields[key];
  }
  return node;
}

export function getIn(root: unknown, path: string): unknown {
  let current: unknown = root;
  for (const key of path.split(".")) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

/** Делит полный контент одного сайта на общий шаблон и собственные поля лендинга */
export function splitSiteContent(full: Content): { template: Content; site: Content } {
  let template = full;
  let site = emptyValue(contentSchema);
  for (const path of SITE_FIELDS) {
    const node = nodeAt(path);
    template = setIn(template, path, emptyValue(node));
    site = setIn(site, path, getIn(full, path));
  }
  return { template, site };
}

/** Оставляет в схеме-объекте только перечисленные пути (вложенные объекты обрезаются рекурсивно) */
function pickFields(node: ObjectNode, paths: readonly string[]): ObjectNode {
  const fields: Record<string, SchemaNode> = {};
  for (const [key, child] of Object.entries(node.fields)) {
    const own = paths.filter((path) => path === key || path.startsWith(`${key}.`));
    if (own.length === 0) continue;
    fields[key] =
      own.includes(key) || child.kind !== "object"
        ? child
        : pickFields(child, own.map((path) => path.slice(key.length + 1)));
  }
  return { ...node, fields };
}

/** Схема «только поля лендинга» - по умолчанию в редакторе области или района */
export const siteSchema: ObjectNode = pickFields(contentSchema, SITE_FIELDS);
