import { locales } from "@/lib/i18n/config";
import { isRecord, type SchemaNode } from "./schema-dsl";
import { contentSchema, type Content } from "./schema";

const filled = (value: unknown): boolean => typeof value === "string" && value.trim() !== "";

/**
 * Наследование «общий шаблон → лендинг»: пустое поле лендинга берёт значение
 * из шаблона. Переводы наследуются по каждому языку отдельно, списки - целиком
 * (пустой список лендинга = список шаблона).
 */
function inheritNode(node: SchemaNode, own: unknown, base: unknown): unknown {
  switch (node.kind) {
    case "text":
    case "image":
      return filled(own) ? own : base;
    case "localized": {
      const mine = isRecord(own) ? own : {};
      const theirs = isRecord(base) ? base : {};
      const result: Record<string, unknown> = {};
      for (const locale of locales) result[locale] = filled(mine[locale]) ? mine[locale] : theirs[locale];
      return result;
    }
    case "object": {
      const mine = isRecord(own) ? own : {};
      const theirs = isRecord(base) ? base : {};
      const result: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(node.fields)) {
        result[key] = inheritNode(child, mine[key], theirs[key]);
      }
      return result;
    }
    case "list":
      return Array.isArray(own) && own.length > 0 ? own : base;
  }
}

/** Итоговый контент лендинга: его поля поверх общего шаблона */
export function inheritFromTemplate(template: Content, site: Content): Content {
  return inheritNode(contentSchema, site, template) as Content;
}
