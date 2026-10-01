"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, App, Button, Grid, Segmented, Tabs, Tag, Tooltip, Typography } from "antd";
import { ExternalLink, LogOut, Save } from "lucide-react";
import { logoutAction, saveContentAction } from "@/app/(admin)/edit/actions";
import { coerce } from "@/lib/content/schema-dsl";
import { contentSchema, type Content, type ContentSectionKey } from "@/lib/content/schema";
import { setIn } from "@/lib/admin/set-in";
import type { AdminErrorCode } from "@/lib/admin/types";
import type { KeepAliveStatus } from "@/lib/admin/editor-data";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { useAdminLang } from "./AdminProviders";
import { EditorEnvContext, NodeField } from "./fields";
import { DRAFT_STORAGE_KEY } from "./admin-strings";

type Props = {
  initialContent: Content;
  initialVersion: string | null;
  seeded: boolean;
  keepAlive: KeepAliveStatus;
  supabaseConfigured: boolean;
  mediaBase: string;
};

const sectionKeys = Object.keys(contentSchema.fields) as ContentSectionKey[];

const readDraft = (): unknown => {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeDraft = (content: Content): void => {
  try {
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* хранилище недоступно - черновик не сохранится */
  }
};

const clearDraft = (): void => {
  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

/** Редактор всего контента сайта: вкладка на каждую секцию схемы */
export default function ContentEditor({
  initialContent,
  initialVersion,
  seeded,
  keepAlive,
  supabaseConfigured,
  mediaBase,
}: Props) {
  const { strings: a, lang, setLang } = useAdminLang();
  const { message, modal } = App.useApp();
  const screens = Grid.useBreakpoint();

  const [content, setContent] = useState<Content>(initialContent);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialContent));
  const [version, setVersion] = useState<string | null>(initialVersion);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState<ContentSectionKey>("header");

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
        writeDraft(contentRef.current);
        message.warning(a.sessionExpired);
        window.setTimeout(() => window.location.reload(), 1200);
        return;
      }
      message.error(a.errors[code]);
    },
    [a, message],
  );

  const saveRef = useRef<(force?: boolean) => Promise<void>>(async () => undefined);
  const save = useCallback(
    async (force = false): Promise<void> => {
      if (saving) return;
      const cleaned = coerce(contentSchema, contentRef.current);
      setSaving(true);
      try {
        const result = await saveContentAction(cleaned, version, force);
        if (result.ok) {
          setVersion(result.version);
          setSavedJson(JSON.stringify(cleaned));
          setContent((current) => (current === contentRef.current ? cleaned : current));
          setSavedAt(new Date());
          clearDraft();
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
    [a, message, modal, reportError, saving, version],
  );
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Восстановление черновика после повторного входа
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    modal.confirm({
      title: a.draftRestoreTitle,
      content: a.draftRestoreText,
      okText: a.draftRestore,
      cancelText: a.draftDiscard,
      onOk: () => {
        setContent(coerce(contentSchema, draft));
        clearDraft();
      },
      onCancel: clearDraft,
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

  const tabs = sectionKeys.map((key) => {
    const node = contentSchema.fields[key];
    return {
      key,
      label: node.label[lang],
      children: (
        <div className="flex flex-col gap-5 pb-4">
          {node.hint && <Alert type="info" showIcon title={node.hint[lang]} />}
          <NodeField
            node={node}
            value={content[key]}
            path={key}
            onChange={handleChange}
            showLabel={false}
            bare
          />
        </div>
      ),
    };
  });

  return (
    <EditorEnvContext.Provider value={env}>
      <div className="min-h-dvh pb-28">
        {/* Верхняя панель */}
        <header className="sticky top-0 z-20 border-b border-navy-700 bg-navy-900/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
            <div className="mr-auto">
              <Typography.Title level={5} style={{ margin: 0 }}>
                {a.appTitle}
              </Typography.Title>
            </div>
            <Tooltip title={a.interfaceLanguage}>
              <Segmented<Locale>
                size="small"
                value={lang}
                onChange={setLang}
                options={locales.map((l) => ({ value: l, label: localeLabels[l].code }))}
              />
            </Tooltip>
            <Button
              href={`/${lang}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLink size={15} aria-hidden />}
            >
              {a.viewSite}
            </Button>
            <form action={logoutAction}>
              <Button htmlType="submit" type="text" icon={<LogOut size={15} aria-hidden />}>
                {a.logout}
              </Button>
            </form>
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5">
          {!supabaseConfigured && <Alert type="error" showIcon title={a.supabaseNotConfigured} />}
          {supabaseConfigured && !seeded && <Alert type="warning" showIcon title={a.notSeeded} />}
          {keepAlive !== null && (
            <Alert
              type="warning"
              showIcon
              title={keepAlive === "never" ? a.keepAliveNever : a.keepAliveStale(keepAlive)}
              description={a.keepAliveHint}
            />
          )}

          <div className="rounded-2xl border border-navy-700 bg-navy-900 p-3 sm:p-5">
            <Tabs
              activeKey={activeSection}
              onChange={(key) => setActiveSection(key as ContentSectionKey)}
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
                  {savedAt
                    ? a.lastSaved(savedAt.toLocaleTimeString(lang === "kz" ? "kk-KZ" : lang))
                    : a.allSaved}
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
    </EditorEnvContext.Provider>
  );
}
