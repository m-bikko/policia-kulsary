"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, App, Breadcrumb, Button, Grid, Switch, Tabs, Tag, Tooltip } from "antd";
import { ArrowLeft, Eye, ExternalLink, Save } from "lucide-react";
import { saveDocumentAction, setSiteStatusAction } from "@/app/(admin)/edit/actions";
import { coerce, isRecord, type ObjectNode } from "@/lib/content/schema-dsl";
import { contentSchema } from "@/lib/content/schema";
import { portalSchema } from "@/lib/content/portal-schema";
import { siteSchema } from "@/lib/content/split";
import { getGeoSite } from "@/lib/geo/kz";
import { setIn } from "@/lib/admin/set-in";
import { editorPath, isSiteKind, type DocKind, type SiteStatus } from "@/lib/admin/documents";
import type { AdminErrorCode } from "@/lib/admin/types";
import type { KeepAliveStatus } from "@/lib/admin/editor-data";
import { useAdminLang } from "./AdminProviders";
import AdminHeader from "./AdminHeader";
import { EditorEnvContext, InheritContext, NodeField } from "./fields";
import { DRAFT_STORAGE_KEY } from "./admin-strings";

type DocValue = Record<string, unknown>;

type Props = {
  docId: string;
  kind: DocKind;
  initialData: unknown;
  initialVersion: string | null;
  initialStatus: SiteStatus;
  /** Общий шаблон - для лендингов (пустые поля наследуются); null для шаблона и портала */
  template: unknown;
  keepAlive: KeepAliveStatus;
  supabaseConfigured: boolean;
  mediaBase: string;
};

/** Приводит данные к схеме документа: портал - своя схема, остальные - схема лендинга */
const coerceDoc = (kind: DocKind, value: unknown): DocValue =>
  kind === "portal" ? coerce(portalSchema, value) : coerce(contentSchema, value);

const draftKey = (id: string): string => `${DRAFT_STORAGE_KEY}:${id}`;

const readDraft = (id: string): unknown => {
  try {
    const raw = window.sessionStorage.getItem(draftKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeDraft = (id: string, value: DocValue): void => {
  try {
    window.sessionStorage.setItem(draftKey(id), JSON.stringify(value));
  } catch {
    /* хранилище недоступно - черновик не сохранится */
  }
};

const clearDraft = (id: string): void => {
  try {
    window.sessionStorage.removeItem(draftKey(id));
  } catch {
    /* ignore */
  }
};

/**
 * Редактор одного документа: вкладка на каждую секцию схемы.
 * Для лендинга по умолчанию видны только его собственные поля - остальное берётся из шаблона.
 */
export default function ContentEditor({
  docId,
  kind,
  initialData,
  initialVersion,
  initialStatus,
  template,
  keepAlive,
  supabaseConfigured,
  mediaBase,
}: Props) {
  const { strings: a, lang } = useAdminLang();
  const { message, modal } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isSite = isSiteKind(kind);
  const geo = getGeoSite(docId);

  const [content, setContent] = useState<DocValue>(() => coerceDoc(kind, initialData));
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(coerceDoc(kind, initialData)));
  const [version, setVersion] = useState<string | null>(initialVersion);
  const [status, setStatus] = useState<SiteStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("header");

  const inheritBase = useMemo(
    () => (isSite && template !== null ? coerce(contentSchema, template) : null),
    [isSite, template],
  );
  const schema: ObjectNode = kind === "portal" ? portalSchema : isSite && !showAll ? siteSchema : contentSchema;
  const sectionKeys = Object.keys(schema.fields);
  const currentSection = sectionKeys.includes(activeSection) ? activeSection : sectionKeys[0];

  const dirty = useMemo(() => JSON.stringify(content) !== savedJson, [content, savedJson]);

  const handleChange = useCallback((path: string, value: unknown) => {
    setContent((previous) => setIn(previous, path, value));
  }, []);

  // Сессия истекла: сохраняем черновик и отправляем на вход - после входа предложим восстановить
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  const reportError = useCallback(
    (code: AdminErrorCode) => {
      if (code === "unauthorized") {
        writeDraft(docId, contentRef.current);
        message.warning(a.sessionExpired);
        window.setTimeout(() => window.location.reload(), 1200);
        return;
      }
      message.error(a.errors[code]);
    },
    [a, docId, message],
  );

  const saveRef = useRef<(force?: boolean) => Promise<void>>(async () => undefined);
  const save = useCallback(
    async (force = false): Promise<void> => {
      if (saving) return;
      const cleaned = coerceDoc(kind, contentRef.current);
      setSaving(true);
      try {
        const result = await saveDocumentAction(docId, cleaned, version, force);
        if (result.ok) {
          setVersion(result.version);
          setSavedJson(JSON.stringify(cleaned));
          setContent((current) => (current === contentRef.current ? cleaned : current));
          setSavedAt(new Date());
          clearDraft(docId);
          message.success(a.saved);
          return;
        }
        if (result.error === "conflict") {
          modal.confirm({
            title: a.conflictTitle,
            content: a.conflictText,
            okText: a.conflictOverwrite,
            okButtonProps: { danger: true },
            cancelText: a.conflictReload,
            onOk: () => saveRef.current(true),
            onCancel: () => window.location.reload(),
          });
          return;
        }
        reportError(result.error);
      } catch {
        reportError("server");
      } finally {
        setSaving(false);
      }
    },
    [a, docId, kind, message, modal, reportError, saving, version],
  );
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const changeStatus = async (published: boolean) => {
    const next: SiteStatus = published ? "published" : "draft";
    setStatusSaving(true);
    try {
      const result = await setSiteStatusAction(docId, next);
      if (result.ok) {
        // Смена статуса сдвигает updated_at - иначе следующее сохранение увидит «конфликт»
        setVersion(result.version);
        setStatus(next);
        message.success(published ? a.publishedNow : a.unpublishedNow);
      } else {
        reportError(result.error);
      }
    } catch {
      reportError("server");
    } finally {
      setStatusSaving(false);
    }
  };

  // Восстановление черновика после повторного входа
  useEffect(() => {
    const draft = readDraft(docId);
    if (!isRecord(draft)) return;
    modal.confirm({
      title: a.draftRestoreTitle,
      content: a.draftRestoreText,
      okText: a.draftRestore,
      cancelText: a.draftDiscard,
      onOk: () => {
        setContent(coerceDoc(kind, draft));
        clearDraft(docId);
      },
      onCancel: () => clearDraft(docId),
    });
    // Только при первом монтировании
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ctrl/⌘ + S
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty && supabaseConfigured) void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, save, supabaseConfigured]);

  // Предупреждение о несохранённых изменениях при уходе со страницы
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const env = useMemo(() => ({ mediaBase, reportError }), [mediaBase, reportError]);

  // Название и путь документа на языке интерфейса
  const title =
    kind === "template" || kind === "portal"
      ? a.kinds[kind]
      : geo?.kind === "district"
        ? geo.district.name[lang]
        : (geo?.region.name[lang] ?? docId);
  const mapHref = geo ? `/edit#${geo.region.slug}` : "/edit";
  const crumbs = [
    { title: a.dashboardTitle, href: mapHref },
    ...(geo?.kind === "district" ? [{ title: geo.region.name[lang], href: editorPath(geo.region.slug) }] : []),
    { title },
  ];
  const publicHref = kind === "portal" ? `/${lang}` : isSite && status === "published" ? `/${lang}/${docId}` : null;

  const tabs = sectionKeys.map((key) => {
    const node = schema.fields[key];
    return {
      key,
      label: node.label[lang],
      children: (
        <div className="flex flex-col gap-5 pb-4">
          {node.hint && <Alert type="info" showIcon title={node.hint[lang]} />}
          <NodeField node={node} value={content[key]} path={key} onChange={handleChange} showLabel={false} bare />
        </div>
      ),
    };
  });

  return (
    <EditorEnvContext.Provider value={env}>
      <InheritContext.Provider value={inheritBase}>
        <div className="min-h-dvh pb-28">
          <AdminHeader>
            <div className="flex min-w-0 items-center gap-2">
              <Tooltip title={a.backToMap}>
                <Button type="text" href={mapHref} aria-label={a.backToMap} icon={<ArrowLeft size={17} aria-hidden />} />
              </Tooltip>
              <div className="min-w-0">
                <Breadcrumb items={crumbs} className="text-xs" />
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-display text-base font-semibold text-ink">{title}</span>
                  <Tag className="m-0 shrink-0">{a.kinds[kind]}</Tag>
                </div>
              </div>
            </div>
          </AdminHeader>

          <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5">
            {!supabaseConfigured && <Alert type="error" showIcon title={a.supabaseNotConfigured} />}
            {supabaseConfigured && version === null && <Alert type="warning" showIcon title={a.notSeeded} />}
            {keepAlive !== null && (
              <Alert
                type="warning"
                showIcon
                title={keepAlive === "never" ? a.keepAliveNever : a.keepAliveStale(keepAlive)}
                description={a.keepAliveHint}
              />
            )}
            {kind === "template" && <Alert type="warning" showIcon title={a.templateWarning} />}

            {/* Публикация и просмотр */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-navy-700 bg-navy-900 px-4 py-3">
              {isSite && (
                <label className="flex min-h-11 items-center gap-3">
                  <Switch
                    checked={status === "published"}
                    loading={statusSaving}
                    disabled={!supabaseConfigured}
                    onChange={(checked) => void changeStatus(checked)}
                  />
                  <span className="text-sm font-semibold text-ink">{a.statusLabel}</span>
                  {status === "draft" && <span className="text-xs text-ink-dim">{a.draftHidden}</span>}
                </label>
              )}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                {isSite && (
                  <Button
                    href={`/edit/preview/${docId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<Eye size={15} aria-hidden />}
                  >
                    {a.preview}
                  </Button>
                )}
                {publicHref && (
                  <Button
                    href={publicHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLink size={15} aria-hidden />}
                  >
                    {a.open}
                  </Button>
                )}
              </div>
            </div>

            {isSite && (
              <div className="flex flex-wrap items-start gap-3">
                <Alert className="min-w-0 flex-1" type="info" showIcon title={a.siteFieldsHint} />
                <Tooltip title={a.showAllFieldsHint}>
                  <label className="flex min-h-11 items-center gap-2 rounded-xl border border-navy-700 bg-navy-900 px-3">
                    <Switch size="small" checked={showAll} onChange={setShowAll} />
                    <span className="text-sm text-ink">{a.showAllFields}</span>
                  </label>
                </Tooltip>
              </div>
            )}

            <div className="rounded-2xl border border-navy-700 bg-navy-900 p-3 sm:p-5">
              <Tabs
                activeKey={currentSection}
                onChange={setActiveSection}
                tabPlacement={screens.lg ? "start" : "top"}
                destroyOnHidden
                items={tabs}
              />
            </div>
          </main>

          {/* Нижняя панель сохранения */}
          <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-navy-700 bg-navy-900/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
              <div className="mr-auto flex min-w-0 flex-col">
                {dirty ? (
                  <Tag color="warning" className="w-fit">
                    {a.unsaved}
                  </Tag>
                ) : (
                  <span className="text-sm text-ink-soft">
                    {savedAt ? a.lastSaved(savedAt.toLocaleTimeString(lang === "kz" ? "kk-KZ" : lang)) : a.allSaved}
                  </span>
                )}
                {screens.md && <span className="mt-0.5 text-xs text-ink-dim">{a.shortcutHint}</span>}
              </div>
              <Button
                type="primary"
                size="large"
                icon={<Save size={17} aria-hidden />}
                loading={saving}
                disabled={!dirty || !supabaseConfigured}
                onClick={() => void save()}
              >
                {a.save}
              </Button>
            </div>
          </footer>
        </div>
      </InheritContext.Provider>
    </EditorEnvContext.Provider>
  );
}
