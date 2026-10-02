import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getPortal, getPublishedSiteIds, getTemplate } from "@/lib/content/get-content";
import { mediaUrl } from "@/lib/content/media";
import { pickLocale } from "@/lib/content/resolve";
import { mediaBaseUrl } from "@/lib/supabase/env";
import PortalDirectory, { type PortalTexts } from "@/components/portal/PortalDirectory";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const portal = await getPortal();
  return { title: pickLocale(portal.meta.title, lang), description: pickLocale(portal.meta.description, lang) };
}

/** Портал: карта Казахстана и каталог лендингов областей и районов */
export default async function PortalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [portal, template, published] = await Promise.all([getPortal(), getTemplate(), getPublishedSiteIds()]);
  const { directory } = portal;
  const s = (value: Parameters<typeof pickLocale>[0]): string => pickLocale(value, lang);
  const texts: PortalTexts = {
    title: s(directory.title),
    subtitle: s(directory.subtitle),
    searchPlaceholder: s(directory.searchPlaceholder),
    allRegions: s(directory.allRegions),
    regionDepartment: s(directory.regionDepartment),
    districtsTitle: s(directory.districtsTitle),
    comingSoon: s(directory.comingSoon),
    notFound: s(directory.notFound),
    emergencyNote: s(directory.emergencyNote),
    police: s(template.emergency.police),
    toDark: s(portal.theme.toDark),
    toLight: s(portal.theme.toLight),
    logoAlt: s(template.header.logoAlt),
  };

  return (
    <PortalDirectory
      lang={lang}
      texts={texts}
      logo={mediaUrl(template.media.logo, mediaBaseUrl())}
      published={[...published].sort()}
    />
  );
}
