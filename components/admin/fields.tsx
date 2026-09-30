"use client";

import { createContext, memo, useContext, useState, type ReactNode } from "react";
import { App, Button, Card, Collapse, Image, Input, Popconfirm, Tooltip, Upload } from "antd";
import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2, Upload as UploadIcon } from "lucide-react";
import {
  emptyValue,
  isRecord,
  type ImageNode,
  type ListNode,
  type LocalizedNode,
  type ObjectNode,
  type SchemaNode,
  type TextNode,
} from "@/lib/content/schema-dsl";
import { mediaUrl } from "@/lib/content/media";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { ALLOWED_IMAGE_TYPES, type AdminErrorCode } from "@/lib/admin/types";
import { uploadImageAction } from "@/app/(admin)/edit/actions";
import { useAdminLang } from "./AdminProviders";
import { prepareImage } from "./prepare-image";

export type OnFieldChange = (path: string, value: unknown) => void;

type EditorEnv = {
  mediaBase: string;
  reportError: (code: AdminErrorCode) => void;
};

/** Окружение редактора: база URL фото и общий обработчик ошибок server actions */
export const EditorEnvContext = createContext<EditorEnv>({
  mediaBase: "",
  reportError: () => undefined,
});

type FieldProps<N extends SchemaNode> = {
  node: N;
  value: unknown;
  path: string;
  onChange: OnFieldChange;
  /** false - подпись не выводится (элемент списка уже подписан заголовком) */
  showLabel?: boolean;
  /** true - объект рисуется без рамки-карточки (секция или элемент списка) */
  bare?: boolean;
};

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

function FieldShell({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-semibold text-ink">{label}</span>}
      {hint && <span className="-mt-0.5 text-xs leading-relaxed text-ink-dim">{hint}</span>}
      {children}
    </div>
  );
}

const placeholders: Record<string, string> = {
  url: "https://",
  tel: "+7 700 000 00 00",
};

/* ── Одно значение для всех языков ─────────────────────────── */

function TextField({ node, value, path, onChange, showLabel = true }: FieldProps<TextNode>) {
  const { lang } = useAdminLang();
  const text = asString(value);
  return (
    <FieldShell label={showLabel ? node.label[lang] : undefined} hint={node.hint?.[lang]}>
      {node.multiline ? (
        <Input.TextArea
          value={text}
          autoSize={{ minRows: 2, maxRows: 12 }}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <Input
          value={text}
          type={node.input === "url" ? "url" : node.input === "tel" ? "tel" : "text"}
          inputMode={node.input === "url" ? "url" : node.input === "tel" ? "tel" : undefined}
          placeholder={node.input ? placeholders[node.input] : undefined}
          onChange={(event) => onChange(path, event.target.value)}
        />
      )}
    </FieldShell>
  );
}

/* ── Переводимый текст: QAZ / RUS / ENG ────────────────────── */

function LocalizedField({
  node,
  value,
  path,
  onChange,
  showLabel = true,
}: FieldProps<LocalizedNode>) {
  const { lang, strings: a } = useAdminLang();
  const record = isRecord(value) ? value : {};
  const texts = {} as Record<Locale, string>;
  for (const locale of locales) texts[locale] = asString(record[locale]);
  const anyFilled = locales.some((locale) => texts[locale].trim() !== "");

  return (
    <FieldShell label={showLabel ? node.label[lang] : undefined} hint={node.hint?.[lang]}>
      <div className="flex flex-col gap-2">
        {locales.map((locale) => {
          const missing = anyFilled && texts[locale].trim() === "";
          const fieldPath = `${path}.${locale}`;
          return (
            <div key={locale} className="flex items-start gap-2">
              <Tooltip title={missing ? a.missingTranslation : localeLabels[locale].name}>
                <span
                  className={`mt-[5px] inline-flex h-[26px] w-12 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-wider ${
                    missing ? "bg-amber-100 text-amber-800" : "bg-gold-500/10 text-gold-400"
                  }`}
                >
                  {localeLabels[locale].code}
                </span>
              </Tooltip>
              {node.multiline ? (
                <Input.TextArea
                  value={texts[locale]}
                  autoSize={{ minRows: 2, maxRows: 12 }}
                  status={missing ? "warning" : undefined}
                  lang={locale === "kz" ? "kk" : locale}
                  onChange={(event) => onChange(fieldPath, event.target.value)}
                />
              ) : (
                <Input
                  value={texts[locale]}
                  type={node.input === "url" ? "url" : "text"}
                  placeholder={node.input === "url" ? placeholders.url : undefined}
                  status={missing ? "warning" : undefined}
                  lang={locale === "kz" ? "kk" : locale}
                  onChange={(event) => onChange(fieldPath, event.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ── Фото в Supabase Storage ───────────────────────────────── */

function ImageField({ node, value, path, onChange, showLabel = true }: FieldProps<ImageNode>) {
  const { lang, strings: a } = useAdminLang();
  const { mediaBase, reportError } = useContext(EditorEnvContext);
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const stored = asString(value);
  const src = mediaUrl(stored, mediaBase);
  const round = node.shape === "round";

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error(a.unsupportedFormat);
      return;
    }
    setUploading(true);
    try {
      const prepared = await prepareImage(file, round ? 900 : 1920);
      const form = new FormData();
      form.append("file", prepared);
      const result = await uploadImageAction(form);
      if (result.ok) {
        onChange(path, result.path);
        message.success(a.uploaded);
      } else {
        reportError(result.error);
      }
    } catch {
      reportError("server");
    } finally {
      setUploading(false);
    }
  };

  return (
    <FieldShell label={showLabel ? node.label[lang] : undefined} hint={node.hint?.[lang]}>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-gold-500/25 bg-navy-850 ${
            round ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-xl"
          }`}
        >
          {src ? (
            <Image
              src={src}
              alt=""
              width={round ? 96 : 160}
              height={96}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-ink-dim">
              <ImageOff size={18} aria-hidden />
              {a.noPhoto}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <Upload
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            showUploadList={false}
            disabled={uploading}
            beforeUpload={(file) => {
              void upload(file);
              return Upload.LIST_IGNORE;
            }}
          >
            <Button icon={<UploadIcon size={16} aria-hidden />} loading={uploading}>
              {uploading ? a.uploading : stored ? a.replace : a.upload}
            </Button>
          </Upload>
          {stored && (
            <Button
              type="text"
              danger
              size="small"
              icon={<Trash2 size={14} aria-hidden />}
              onClick={() => onChange(path, "")}
            >
              {a.removePhoto}
            </Button>
          )}
        </div>
      </div>
    </FieldShell>
  );
}

/* ── Группа полей ──────────────────────────────────────────── */

function ObjectField({ node, value, path, onChange, bare = false }: FieldProps<ObjectNode>) {
  const { lang } = useAdminLang();
  const record = isRecord(value) ? value : {};
  const fields = (
    <div className="flex flex-col gap-5">
      {Object.entries(node.fields).map(([key, child]) => (
        <NodeField
          key={key}
          node={child}
          value={record[key]}
          path={path ? `${path}.${key}` : key}
          onChange={onChange}
        />
      ))}
    </div>
  );
  if (bare) return fields;
  return (
    <Card size="small" title={node.label[lang]}>
      {node.hint && <p className="mb-4 text-xs text-ink-dim">{node.hint[lang]}</p>}
      {fields}
    </Card>
  );
}

/* ── Список: добавить / удалить / переставить ──────────────── */

function previewText(node: SchemaNode, value: unknown, lang: Locale): string {
  let text = "";
  if (node.kind === "text") text = asString(value);
  if (node.kind === "localized" && isRecord(value)) {
    text = [lang, ...locales].map((l) => asString(value[l])).find((t) => t.trim()) ?? "";
  }
  text = text.trim();
  return text.length > 70 ? `${text.slice(0, 70)}…` : text;
}

function listItemTitle(node: ListNode, item: unknown, lang: Locale): string {
  if (node.item.kind === "object" && node.titleKey && isRecord(item)) {
    const child = node.item.fields[node.titleKey];
    return child ? previewText(child, item[node.titleKey], lang) : "";
  }
  return previewText(node.item, item, lang);
}

function ListField({ node, value, path, onChange }: FieldProps<ListNode>) {
  const { lang, strings: a } = useAdminLang();
  const items = Array.isArray(value) ? value : [];
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const itemLabel = node.itemLabel[lang];

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(path, next);
    setOpenKeys((keys) =>
      keys.map((key) => (key === String(from) ? String(to) : key === String(to) ? String(from) : key)),
    );
  };

  const remove = (index: number) => {
    onChange(
      path,
      items.filter((_, position) => position !== index),
    );
    setOpenKeys([]);
  };

  const add = () => {
    onChange(path, [...items, emptyValue(node.item)]);
    setOpenKeys((keys) => [...keys, String(items.length)]);
  };

  const controls = (index: number) => (
    <div
      className="flex shrink-0 items-center gap-0.5"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Tooltip title={a.moveUp}>
        <Button
          size="small"
          type="text"
          aria-label={a.moveUp}
          icon={<ArrowUp size={15} aria-hidden />}
          disabled={index === 0}
          onClick={() => move(index, index - 1)}
        />
      </Tooltip>
      <Tooltip title={a.moveDown}>
        <Button
          size="small"
          type="text"
          aria-label={a.moveDown}
          icon={<ArrowDown size={15} aria-hidden />}
          disabled={index === items.length - 1}
          onClick={() => move(index, index + 1)}
        />
      </Tooltip>
      <Popconfirm
        title={a.removeConfirm}
        okText={a.yes}
        cancelText={a.no}
        okButtonProps={{ danger: true }}
        onConfirm={() => remove(index)}
      >
        <Button
          size="small"
          type="text"
          danger
          aria-label={a.removeItem}
          icon={<Trash2 size={15} aria-hidden />}
        />
      </Popconfirm>
    </div>
  );

  const header = (index: number, item: unknown) => {
    const title = listItemTitle(node, item, lang);
    return (
      <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <span className="shrink-0 font-semibold">
          {itemLabel} {index + 1}
        </span>
        <span className="block min-w-0 truncate text-ink-dim">{title || a.untitled}</span>
      </span>
    );
  };

  return (
    <FieldShell label={node.label[lang]} hint={node.hint?.[lang]}>
      {items.length === 0 && <p className="text-sm text-ink-dim">{a.emptyList}</p>}

      {node.item.kind === "object" ? (
        items.length > 0 && (
          <Collapse
            className="admin-collapse"
            activeKey={openKeys}
            onChange={(keys) => setOpenKeys((Array.isArray(keys) ? keys : [keys]).map(String))}
            items={items.map((item, index) => ({
              key: String(index),
              label: header(index, item),
              extra: controls(index),
              children: (
                <NodeField
                  node={node.item}
                  value={item}
                  path={`${path}.${index}`}
                  onChange={onChange}
                  showLabel={false}
                  bare
                />
              ),
            }))}
          />
        )
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border border-navy-700 bg-navy-900 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
                  {itemLabel} {index + 1}
                </span>
                {controls(index)}
              </div>
              <NodeField
                node={node.item}
                value={item}
                path={`${path}.${index}`}
                onChange={onChange}
                showLabel={false}
              />
            </div>
          ))}
        </div>
      )}

      <Button
        className="mt-2"
        type="dashed"
        block
        icon={<Plus size={16} aria-hidden />}
        onClick={add}
      >
        {a.addItem(itemLabel)}
      </Button>
    </FieldShell>
  );
}

/* ── Диспетчер по типу узла схемы ──────────────────────────── */

/**
 * Рекурсивное поле редактора. Мемоизировано: при вводе перерисовывается
 * только изменённая ветка (setIn сохраняет идентичность остальных).
 */
export const NodeField = memo(function NodeField(props: FieldProps<SchemaNode>) {
  const { node } = props;
  switch (node.kind) {
    case "text":
      return <TextField {...props} node={node} />;
    case "localized":
      return <LocalizedField {...props} node={node} />;
    case "image":
      return <ImageField {...props} node={node} />;
    case "object":
      return <ObjectField {...props} node={node} />;
    case "list":
      return <ListField {...props} node={node} />;
  }
});
