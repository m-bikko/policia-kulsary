import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { districtSiteId, districtsOf, getGeoSite, sitePath, type GeoSite } from "@/lib/geo/kz";
import type { SiteNav } from "@/components/taplink/TaplinkPage";
import { getPublishedSiteIds } from "./get-content";
import { getSiteDictionary } from "./get-dictionary";
import { faviconUrl } from "./media";

export type Landing = { dict: Dictionary; nav: SiteNav };

/** Портал с приближенной областью: /kz#atyrau */
const portalRegionHref = (locale: Locale, regionSlug: string): string => `/${locale}#${regionSlug}`;

/**
 * Данные лендинга области или района: словарь (поля лендинга поверх шаблона)
 * и навигация внутри портала. null - адрес не из карты или лендинг ещё черновик.
 */
export async function loadLanding(locale: Locale, siteId: string, kind: GeoSite["kind"]): Promise<Landing | null> {
  const site = getGeoSite(siteId);
  if (!site || site.kind !== kind) return null;

  const [dict, published] = await Promise.all([getSiteDictionary(siteId, locale), getPublishedSiteIds()]);
  if (!dict) return null;
  return buildLanding(locale, site, dict, published);
}

/** Навигация лендинга: «назад», ссылка на область, список районов (опубликованные - ссылками) */
export function buildLanding(locale: Locale, site: GeoSite, dict: Dictionary, published: ReadonlySet<string>): Landing {
  const siteId = site.id;
  const portalHref = `/${locale}`;
  const regionName = site.region.name[locale];
  const regionHref = published.has(site.region.slug) ? sitePath(locale, site.region.slug) : null;

  if (site.kind === "district") {
    return {
      dict,
      nav: {
        path: siteId,
        portalHref,
        back: regionHref
          ? { href: regionHref, label: regionName }
          : { href: portalRegionHref(locale, site.region.slug), label: dict.footer.portalLink },
        parent: { label: regionName, href: regionHref },
      },
    };
  }

  // Лендинг области: опубликованные районы первыми, внутри - по алфавиту
  const collator = new Intl.Collator(locale === "kz" ? "kk" : locale);
  const districts = districtsOf(site.region.slug)
    .map((district) => {
      const id = districtSiteId(district);
      return { id, name: district.name[locale], href: published.has(id) ? sitePath(locale, id) : null };
    })
    .sort((a, b) => Number(Boolean(b.href)) - Number(Boolean(a.href)) || collator.compare(a.name, b.name));

  return {
    dict,
    nav: {
      path: siteId,
      portalHref,
      back: { href: portalRegionHref(locale, site.region.slug), label: dict.footer.portalLink },
      districts,
    },
  };
}

/** Заголовок, описание и иконка вкладки лендинга */
export function landingMetadata(landing: Landing | null): Metadata {
  if (!landing) return {};
  const { dict } = landing;
  const icon = faviconUrl(dict.media.logo);
  return {
    title: dict.meta.title,
    description: dict.meta.description || undefined,
    icons: icon ? { icon } : undefined,
  };
}
