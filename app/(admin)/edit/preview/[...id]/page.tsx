import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/session";
import { getAdminLang } from "@/lib/admin/lang";
import { loadDoc, loadDocRows } from "@/lib/admin/editor-data";
import { TEMPLATE_ID } from "@/lib/admin/documents";
import { coerce } from "@/lib/content/schema-dsl";
import { contentSchema } from "@/lib/content/schema";
import { inheritFromTemplate } from "@/lib/content/inherit";
import { resolveDictionary } from "@/lib/content/resolve";
import { buildLanding } from "@/lib/content/landing";
import { getGeoSite } from "@/lib/geo/kz";
import { mediaBaseUrl } from "@/lib/supabase/env";
import { adminStrings } from "@/components/admin/admin-strings";
import LoginScreen from "@/components/admin/LoginScreen";
import TaplinkPage from "@/components/taplink/TaplinkPage";

export const dynamic = "force-dynamic";

/**
 * Предпросмотр сохранённой версии лендинга - в том числе черновика, который не виден
 * на сайте. Язык - ?lang=kz|ru|en, по умолчанию язык интерфейса редактора.
 */
export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string[] }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ id: segments }, { lang: langParam }] = await Promise.all([params, searchParams]);
  const id = segments.map(decodeURIComponent).join("/");

  if (!(await isAuthenticated())) {
    return <LoginScreen adminConfigured={isAdminConfigured()} next={`/edit/preview/${id}`} />;
  }
  const site = getGeoSite(id);
  if (!site) notFound();

  const lang: Locale = langParam && isLocale(langParam) ? langParam : await getAdminLang();
  const [doc, template, rows] = await Promise.all([loadDoc(id), loadDoc(TEMPLATE_ID), loadDocRows()]);
  if (!doc || !template) notFound();

  const content = inheritFromTemplate(coerce(contentSchema, template.data), coerce(contentSchema, doc.data));
  const dict = resolveDictionary(content, lang, mediaBaseUrl());
  const published = new Set((rows ?? []).filter((row) => row.status === "published").map((row) => row.id));
  const { nav } = buildLanding(lang, site, dict, published);
  const langHrefs = Object.fromEntries(
    locales.map((locale) => [locale, `/edit/preview/${id}?lang=${locale}`]),
  ) as Record<Locale, string>;

  return (
    <div className="bg-ceremonial grain min-h-dvh">
      <p
        role="status"
        className="sticky top-0 z-30 bg-gold-solid px-4 py-2 text-center text-xs font-semibold text-on-gold"
      >
        {adminStrings[lang].previewBanner}
      </p>
      <TaplinkPage dict={dict} lang={lang} nav={{ ...nav, langHrefs }} />
    </div>
  );
}
