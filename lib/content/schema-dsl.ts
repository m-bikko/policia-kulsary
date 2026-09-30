import { locales, type Locale } from "@/lib/i18n/config";

/**
 * Мини-DSL схемы контента. Одно описание даёт сразу три вещи:
 * 1) TypeScript-тип контента (`Infer<typeof schema>`),
 * 2) серверную валидацию/нормализацию (`coerce`),
 * 3) форму редактора в /edit (узлы несут подписи на трёх языках).
 */

/** Строка сразу на трёх языках сайта */
export type Localized = Record<Locale, string>;

/** Подпись поля в админке - тоже на трёх языках */
export type Label = Localized;

type NodeBase = {
  label: Label;
  hint?: Label;
};

/** Одно значение для всех языков: телефон, ссылка, число */
export type TextNode = NodeBase & {
  kind: "text";
  multiline?: boolean;
  input?: "text" | "tel" | "url";
};

/** Переводимый текст: kz / ru / en */
export type LocalizedNode = NodeBase & {
  kind: "localized";
  multiline?: boolean;
  input?: "text" | "url";
};

/** Фото в Supabase Storage: хранится путь объекта в бакете */
export type ImageNode = NodeBase & {
  kind: "image";
  shape?: "round" | "wide";
};

export interface ObjectNode<F extends Fields = Fields> extends NodeBase {
  kind: "object";
  fields: F;
}

export interface ListNode<I extends SchemaNode = SchemaNode> extends NodeBase {
  kind: "list";
  item: I;
  itemLabel: Label;
  /** Ключ поля элемента, чей текст показывается в свёрнутом заголовке */
  titleKey?: string;
}

export type Fields = { readonly [key: string]: SchemaNode };

export type SchemaNode =
  | TextNode
  | LocalizedNode
  | ImageNode
  | ObjectNode
  | ListNode;

export type Infer<N> = N extends TextNode
  ? string
  : N extends LocalizedNode
    ? Localized
    : N extends ImageNode
      ? string
      : N extends ObjectNode<infer F>
        ? { [K in keyof F]: Infer<F[K]> }
        : N extends ListNode<infer I>
          ? Infer<I>[]
          : never;

/* ── Конструкторы ───────────────────────────────────────────── */

export const t = (kz: string, ru: string, en: string): Label => ({ kz, ru, en });

type NodeOptions<N> = Omit<N, "kind" | "label">;

export const text = (label: Label, opts: NodeOptions<TextNode> = {}): TextNode => ({
  kind: "text",
  label,
  ...opts,
});

export const loc = (
  label: Label,
  opts: NodeOptions<LocalizedNode> = {},
): LocalizedNode => ({ kind: "localized", label, ...opts });

export const image = (label: Label, opts: NodeOptions<ImageNode> = {}): ImageNode => ({
  kind: "image",
  label,
  ...opts,
});

export const obj = <const F extends Fields>(
  label: Label,
  fields: F,
  opts: { hint?: Label } = {},
): ObjectNode<F> => ({ kind: "object", label, fields, ...opts });

export const list = <const I extends SchemaNode>(
  label: Label,
  itemLabel: Label,
  item: I,
  opts: { hint?: Label; titleKey?: string } = {},
): ListNode<I> => ({ kind: "list", label, itemLabel, item, ...opts });

/* ── Нормализация (валидация) ───────────────────────────────── */

const MAX_TEXT_LENGTH = 5000;
const MAX_LIST_LENGTH = 100;
const SAFE_URL = /^(https?:\/\/|tel:|mailto:)/i;
const STORAGE_PATH = /^[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/;

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function cleanText(value: unknown, input?: string): string {
  if (typeof value !== "string") return "";
  const text = value.slice(0, MAX_TEXT_LENGTH);
  if (input !== "url") return text;
  // В ссылки пропускаем только безопасные схемы - javascript: и прочее отбрасывается
  const trimmed = text.trim();
  return trimmed === "" || SAFE_URL.test(trimmed) ? trimmed : "";
}

function cleanImage(value: unknown): string {
  if (typeof value !== "string") return "";
  const path = value.trim();
  if (path === "") return "";
  if (/^https:\/\//i.test(path)) return path;
  return STORAGE_PATH.test(path) && !path.includes("..") ? path : "";
}

function coerceNode(node: SchemaNode, value: unknown): unknown {
  switch (node.kind) {
    case "text":
      return cleanText(value, node.input);
    case "image":
      return cleanImage(value);
    case "localized": {
      const source = isRecord(value) ? value : {};
      const result = {} as Localized;
      for (const locale of locales) result[locale] = cleanText(source[locale], node.input);
      return result;
    }
    case "object": {
      const source = isRecord(value) ? value : {};
      const result: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(node.fields)) {
        result[key] = coerceNode(child, source[key]);
      }
      return result;
    }
    case "list":
      return Array.isArray(value)
        ? value.slice(0, MAX_LIST_LENGTH).map((item) => coerceNode(node.item, item))
        : [];
  }
}

/**
 * Приводит произвольные данные к форме схемы: недостающие поля заполняются
 * пустыми значениями, лишние отбрасываются, опасные ссылки обнуляются.
 */
export function coerce<N extends SchemaNode>(node: N, value: unknown): Infer<N> {
  return coerceNode(node, value) as Infer<N>;
}

/** Пустое значение узла - для новых элементов списков */
export function emptyValue<N extends SchemaNode>(node: N): Infer<N> {
  return coerce(node, undefined);
}
