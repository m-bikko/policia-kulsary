"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Input, Tag } from "antd";
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Layers, Pencil, Search } from "lucide-react";
import { districtSiteId, kzMap } from "@/lib/geo/kz";
import { editorPath, PORTAL_ID, TEMPLATE_ID, type DocRow, type SiteStatus } from "@/lib/admin/documents";
import type { KeepAliveStatus } from "@/lib/admin/editor-data";
import KzMapView, { type MapDistrict, type MapRegion, type MapSiteState } from "@/components/map/KzMapView";
import { useRegionHash } from "@/components/map/use-region-hash";
import { searchGeo } from "@/components/map/search";
import { useAdminLang } from "./AdminProviders";
import AdminHeader from "./AdminHeader";

const regions: MapRegion[] = kzMap.regions.map(({ slug, name, path, bbox }) => ({ slug, name, path, bbox }));
const districts: MapDistrict[] = kzMap.districts.map((district) => ({
  id: districtSiteId(district),
  slug: district.slug,
  region: district.region,
  name: district.name,
  path: district.path,
  bbox: district.bbox,
}));
const regionSlugs = new Set(regions.map((region) => region.slug));
const TOTAL_SITES = regions.length + districts.length;

type Props = {
  /** null - не удалось прочитать базу */
  rows: DocRow[] | null;
  keepAlive: KeepAliveStatus;
  supabaseConfigured: boolean;
};

/**
 * Главная редактора: карта Казахстана со статусами лендингов (золото - опубликован,
 * серый - черновик), список областей и районов, общий шаблон и портал.
 */
export default function AdminDashboard({ rows, keepAlive, supabaseConfigured }: Props) {
  const { strings: a, lang } = useAdminLang();
  const router = useRouter();
  const [selectedRegion, selectRegion] = useRegionHash(regionSlugs);
  const [query, setQuery] = useState("");

  const states = useMemo(() => {
    const result: Record<string, MapSiteState> = {};
    for (const row of rows ?? []) {
      if (row.kind === "region" || row.kind === "district") result[row.id] = row.status;
    }
    return result;
  }, [rows]);
  const publishedCount = Object.values(states).filter((state) => state === "published").length;
  const statusOf = (id: string): SiteStatus => states[id] ?? "draft";

  const collator = useMemo(() => new Intl.Collator(lang === "kz" ? "kk" : lang), [lang]);
  const sortedRegions = useMemo(
    () => [...regions].sort((x, y) => collator.compare(x.name[lang], y.name[lang])),
    [collator, lang],
  );
  const region = selectedRegion ? (regions.find((item) => item.slug === selectedRegion) ?? null) : null;
  const regionDistricts = useMemo(
    () =>
      selectedRegion
        ? districts
            .filter((district) => district.region === selectedRegion)
            .sort((x, y) => collator.compare(x.name[lang], y.name[lang]))
        : [],
    [selectedRegion, collator, lang],
  );
  const publishedIn = useMemo(() => {
    const counts = new Map<string, number>();
    for (const [id, state] of Object.entries(states)) {
      if (state !== "published") continue;
      const slug = id.split("/")[0];
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return counts;
  }, [states]);
  const results = useMemo(() => searchGeo(query), [query]);
  const regionName = (slug: string): string => regions.find((item) => item.slug === slug)?.name[lang] ?? "";

  const goRegion = (slug: string | null) => {
    setQuery("");
    selectRegion(slug);
  };

  return (
    <div className="min-h-dvh pb-16">
      <AdminHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-5">
        {!supabaseConfigured && <Alert type="error" showIcon title={a.supabaseNotConfigured} />}
        {supabaseConfigured && rows === null && <Alert type="error" showIcon title={a.loadFailed} />}
        {keepAlive !== null && (
          <Alert
            type="warning"
            showIcon
            title={keepAlive === "never" ? a.keepAliveNever : a.keepAliveStale(keepAlive)}
            description={a.keepAliveHint}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DocCard
            href={editorPath(TEMPLATE_ID)}
            icon={<Layers size={20} aria-hidden />}
            title={a.kinds.template}
            description={a.templateDescription}
            action={a.edit}
          />
          <DocCard
            href={editorPath(PORTAL_ID)}
            icon={<Globe size={20} aria-hidden />}
            title={a.kinds.portal}
            description={a.portalDescription}
            action={a.edit}
            extra={
              <Button
                type="text"
                size="small"
                href={`/${lang}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={a.open}
                icon={<ExternalLink size={15} aria-hidden />}
              />
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section className="rounded-2xl border border-navy-700 bg-navy-900 p-3 sm:p-5" aria-labelledby="admin-map-title">
            <div className="mb-1 flex min-h-11 flex-wrap items-center justify-between gap-2 px-1">
              <div className="min-w-0">
                <h1 id="admin-map-title" className="font-display text-base font-semibold text-ink">
                  {region ? region.name[lang] : a.dashboardTitle}
                </h1>
                <p className="text-xs text-ink-dim">{a.publishedCount(publishedCount, TOTAL_SITES)}</p>
              </div>
              {region && (
                <Button icon={<ChevronLeft size={15} aria-hidden />} onClick={() => goRegion(null)}>
                  {a.allRegions}
                </Button>
              )}
            </div>
            <KzMapView
              viewBox={kzMap.viewBox}
              regions={regions}
              districts={districts}
              locale={lang}
              states={states}
              selectedRegion={selectedRegion}
              onSelectRegion={goRegion}
              onSelectDistrict={(id) => router.push(editorPath(id))}
              label={a.dashboardTitle}
              attribution={kzMap.attribution}
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-ink-soft">
              <Legend color="var(--map-published)" label={a.published} />
              <Legend color="var(--map-draft)" label={a.draft} />
              <span className="text-ink-dim">{a.mapHint}</span>
            </div>
          </section>

          <aside className="rounded-2xl border border-navy-700 bg-navy-900 p-3 sm:p-4 lg:sticky lg:top-20">
            <Input
              size="large"
              allowClear
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={a.searchPlaceholder}
              aria-label={a.searchPlaceholder}
              prefix={<Search size={16} className="text-ink-dim" aria-hidden />}
            />
            <div className="mt-3 lg:max-h-[min(62vh,640px)] lg:overflow-y-auto lg:pr-1">
              {query.trim() ? (
                results.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-ink-dim">{a.nothingFound}</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {results.map((item) => (
                      <li key={item.id}>
                        {item.kind === "region" ? (
                          <RegionButton
                            name={item.name[lang]}
                            published={publishedIn.get(item.id) ?? 0}
                            onClick={() => goRegion(item.id)}
                          />
                        ) : (
                          <SiteLink
                            id={item.id}
                            name={item.name[lang]}
                            meta={regionName(item.region)}
                            status={statusOf(item.id)}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                )
              ) : region ? (
                <div className="flex flex-col gap-4">
                  <SiteLink id={region.slug} name={a.regionLanding} meta={region.name[lang]} status={statusOf(region.slug)} />
                  <div>
                    <p className="px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">{a.districtsTitle}</p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {regionDistricts.map((district) => (
                        <li key={district.id}>
                          <SiteLink id={district.id} name={district.name[lang]} status={statusOf(district.id)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {sortedRegions.map((item) => (
                    <li key={item.slug}>
                      <RegionButton
                        name={item.name[lang]}
                        published={publishedIn.get(item.slug) ?? 0}
                        onClick={() => goRegion(item.slug)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function DocCard({
  href,
  icon,
  title,
  description,
  action,
  extra,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  extra?: ReactNode;
}) {
  return (
    <Card size="small">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{title}</p>
          <p className="text-xs leading-snug text-ink-dim">{description}</p>
        </div>
        {extra}
        <Button href={href} icon={<Pencil size={15} aria-hidden />}>
          {action}
        </Button>
      </div>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="h-3 w-3 rounded-sm border border-navy-700" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Область в списке: открывает её на карте; число - опубликованные лендинги внутри */
function RegionButton({ name, published, onClick }: { name: string; published: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-gold-500/10"
    >
      <span className="min-w-0 flex-1">{name}</span>
      {published > 0 && (
        <Tag color="gold" className="m-0">
          {published}
        </Tag>
      )}
      <ChevronRight size={16} className="shrink-0 text-ink-dim" aria-hidden />
    </button>
  );
}

/** Лендинг в списке: переход в редактор, статус публикации */
function SiteLink({ id, name, meta, status }: { id: string; name: string; meta?: string; status: SiteStatus }) {
  const { strings: a } = useAdminLang();
  return (
    <a
      href={editorPath(id)}
      className="flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-gold-500/30 hover:bg-gold-500/5"
    >
      <span className="min-w-0 flex-1">
        <span className={`block text-sm ${status === "published" ? "font-semibold text-ink" : "text-ink-soft"}`}>{name}</span>
        {meta && <span className="block text-xs text-ink-dim">{meta}</span>}
      </span>
      <Tag color={status === "published" ? "success" : "default"} className="m-0 shrink-0">
        {status === "published" ? a.published : a.draft}
      </Tag>
      <Pencil size={14} className="shrink-0 text-ink-dim" aria-hidden />
    </a>
  );
}
