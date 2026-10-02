"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { Building2, ChevronLeft, ChevronRight, Phone, Search, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { districtSiteId, kzMap, sitePath } from "@/lib/geo/kz";
import KzMapView, { type MapDistrict, type MapRegion, type MapSiteState } from "@/components/map/KzMapView";
import { useRegionHash } from "@/components/map/use-region-hash";
import { searchGeo } from "@/components/map/search";
import ThemeToggle from "@/components/ThemeToggle";
import LangSwitcher from "@/components/LangSwitcher";

/** Тексты портала на текущем языке (из контента 'portal' и общего шаблона) */
export type PortalTexts = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  allRegions: string;
  regionDepartment: string;
  districtsTitle: string;
  comingSoon: string;
  notFound: string;
  emergencyNote: string;
  police: string;
  toDark: string;
  toLight: string;
  logoAlt: string;
};

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

type Props = {
  lang: Locale;
  texts: PortalTexts;
  logo: string;
  /** id опубликованных лендингов */
  published: string[];
};

/**
 * Портал «Найдите полицию своего района»: карта Казахстана с приближением в область,
 * поиск и список лендингов. Опубликованные лендинги - ссылки, черновики - «готовится».
 */
export default function PortalDirectory({ lang, texts, logo, published }: Props) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [selectedRegion, selectRegion] = useRegionHash(regionSlugs);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);

  const publishedSet = useMemo(() => new Set(published), [published]);
  const states = useMemo(() => {
    const result: Record<string, MapSiteState> = {};
    for (const id of published) result[id] = "published";
    return result;
  }, [published]);

  const collator = useMemo(() => new Intl.Collator(lang === "kz" ? "kk" : lang), [lang]);
  const hrefOf = (id: string): string | null => (publishedSet.has(id) ? sitePath(lang, id) : null);
  const region = selectedRegion ? (regions.find((item) => item.slug === selectedRegion) ?? null) : null;
  const activeHighlight = highlight && selectedRegion && highlight.startsWith(`${selectedRegion}/`) ? highlight : null;

  const sortedRegions = useMemo(
    () => [...regions].sort((a, b) => collator.compare(a.name[lang], b.name[lang])),
    [collator, lang],
  );
  const regionDistricts = useMemo(
    () =>
      selectedRegion
        ? districts
            .filter((district) => district.region === selectedRegion)
            .sort(
              (a, b) =>
                Number(publishedSet.has(b.id)) - Number(publishedSet.has(a.id)) ||
                collator.compare(a.name[lang], b.name[lang]),
            )
        : [],
    [selectedRegion, publishedSet, collator, lang],
  );
  const regionHasLanding = useMemo(() => {
    const active = new Set<string>();
    for (const id of published) active.add(id.split("/")[0]);
    return active;
  }, [published]);

  const results = useMemo(() => searchGeo(query), [query]);
  const searching = query.trim() !== "";

  const goRegion = (slug: string | null) => {
    setHighlight(null);
    setQuery("");
    selectRegion(slug);
  };

  const pickDistrict = (id: string) => {
    const href = hrefOf(id);
    if (href) {
      router.push(href);
      return;
    }
    setHighlight(id);
    document
      .getElementById(`district-${id}`)
      ?.scrollIntoView({ block: "nearest", behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const regionName = (slug: string): string => regions.find((item) => item.slug === slug)?.name[lang] ?? "";

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
      <div className="flex items-center justify-between gap-3 pt-4">
        <Link href="/" className="rounded-full border border-gold-500/50 p-1" aria-label={texts.logoAlt}>
          {logo ? (
            <Image src={logo} alt="" width={44} height={44} priority className="rounded-full" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-800 text-gold-400">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle labelToDark={texts.toDark} labelToLight={texts.toLight} />
          <LangSwitcher current={lang} path="" hash={selectedRegion} />
        </div>
      </div>

      <header className="mt-8 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold leading-tight text-ink text-balance sm:text-4xl">
          {texts.title}
        </h1>
        {texts.subtitle && <p className="mt-3 text-sm text-ink-soft sm:text-base">{texts.subtitle}</p>}
        <a
          href="tel:102"
          className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full border border-gold-500/30 bg-navy-900/70 py-1 pl-1 pr-4 text-sm text-ink-soft transition-colors hover:border-gold-500/60"
        >
          <span className="flex h-9 items-center gap-1.5 rounded-full bg-gold-solid px-3 font-display font-bold text-on-gold">
            <Phone className="h-4 w-4" aria-hidden />
            102
          </span>
          <span>{texts.emergencyNote}</span>
          <span className="sr-only">{texts.police}</span>
        </a>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="card-official corner-accents rounded-2xl p-3 sm:p-5" aria-labelledby="portal-map-title">
          <div className="flex min-h-11 items-center justify-between gap-3 px-1">
            {region ? (
              <button
                type="button"
                onClick={() => goRegion(null)}
                className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-ink-soft transition-colors hover:text-gold-300"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {texts.allRegions}
              </button>
            ) : (
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-500">{texts.allRegions}</p>
            )}
            {/* Без выбранной области заголовок карты - H1 страницы, поэтому здесь он только для скринридеров */}
            <h2
              id="portal-map-title"
              className={region ? "truncate text-right font-display text-sm font-semibold text-ink sm:text-base" : "sr-only"}
            >
              {region ? region.name[lang] : texts.title}
            </h2>
          </div>
          <KzMapView
            viewBox={kzMap.viewBox}
            regions={regions}
            districts={districts}
            locale={lang}
            states={states}
            selectedRegion={selectedRegion}
            selectedSiteId={activeHighlight}
            onSelectRegion={goRegion}
            onSelectDistrict={pickDistrict}
            label={texts.title}
            attribution={kzMap.attribution}
          />
        </section>

        <aside className="card-official rounded-2xl p-3 sm:p-4 lg:sticky lg:top-4">
          <label className="relative block">
            <span className="sr-only">{texts.searchPlaceholder}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-dim" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={texts.searchPlaceholder}
              className="min-h-12 w-full rounded-xl border border-gold-500/20 bg-navy-850 pl-10 pr-3 text-sm text-ink placeholder:text-ink-dim focus:border-gold-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/30"
            />
          </label>

          <div className="mt-3 lg:max-h-[min(62vh,640px)] lg:overflow-y-auto lg:pr-1">
            {searching ? (
              results.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-ink-dim">{texts.notFound}</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {results.map((item) =>
                    item.kind === "region" ? (
                      <li key={item.id}>
                        <RowButton onClick={() => goRegion(item.id)} title={item.name[lang]} accent={regionHasLanding.has(item.id)} />
                      </li>
                    ) : (
                      <li key={item.id}>
                        <SiteRow
                          id={item.id}
                          title={item.name[lang]}
                          meta={regionName(item.region)}
                          href={hrefOf(item.id)}
                          comingSoon={texts.comingSoon}
                          highlighted={false}
                        />
                      </li>
                    ),
                  )}
                </ul>
              )
            ) : region ? (
              <div className="flex flex-col gap-4">
                <SiteRow
                  id={region.slug}
                  title={texts.regionDepartment}
                  meta={region.name[lang]}
                  href={hrefOf(region.slug)}
                  comingSoon={texts.comingSoon}
                  highlighted={false}
                  icon
                />
                <div>
                  <p className="px-1 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-500">{texts.districtsTitle}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {regionDistricts.map((district) => (
                      <li key={district.id} id={`district-${district.id}`}>
                        <SiteRow
                          id={district.id}
                          title={district.name[lang]}
                          href={hrefOf(district.id)}
                          comingSoon={texts.comingSoon}
                          highlighted={district.id === activeHighlight}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {sortedRegions.map((item) => (
                  <li key={item.slug}>
                    <RowButton onClick={() => goRegion(item.slug)} title={item.name[lang]} accent={regionHasLanding.has(item.slug)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Строка-кнопка области: открывает её на карте */
function RowButton({ onClick, title, accent }: { onClick: () => void; title: string; accent: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-gold-500/10"
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full ${accent ? "bg-gold-solid" : "border border-ink-dim/50"}`}
      />
      <span className="min-w-0 flex-1">{title}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-dim" aria-hidden />
    </button>
  );
}

/** Лендинг в списке: опубликован - ссылка, черновик - неактивная строка с меткой «готовится» */
function SiteRow({
  id,
  title,
  meta,
  href,
  comingSoon,
  highlighted,
  icon = false,
}: {
  id: string;
  title: string;
  meta?: string;
  href: string | null;
  comingSoon: string;
  highlighted: boolean;
  icon?: boolean;
}) {
  const body = (
    <>
      {icon && <Building2 className={`h-5 w-5 shrink-0 ${href ? "text-gold-400" : "text-ink-dim"}`} aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className={`block text-sm ${href ? "font-semibold text-ink" : "text-ink-soft"}`}>{title}</span>
        {meta && <span className="mt-0.5 block text-xs text-ink-dim">{meta}</span>}
      </span>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        data-site={id}
        className="card-official group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5"
      >
        {body}
        <ChevronRight className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    );
  }
  return (
    <div
      aria-disabled="true"
      data-site={id}
      className={`flex min-h-12 items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 transition-colors ${
        highlighted ? "border-gold-500 bg-gold-500/10" : "border-ink-dim/30"
      }`}
    >
      {body}
      <span className="shrink-0 rounded-full bg-navy-850 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-dim">
        {comingSoon}
      </span>
    </div>
  );
}
