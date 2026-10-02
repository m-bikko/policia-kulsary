import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getGeoSite } from "@/lib/geo/kz";
import { getPublishedSiteIds } from "@/lib/content/get-content";
import { landingMetadata, loadLanding } from "@/lib/content/landing";
import TaplinkPage from "@/components/taplink/TaplinkPage";

type Params = { lang: string; region: string; district: string };

/** На сборке - только опубликованные лендинги районов; остальные рендерятся по запросу */
export async function generateStaticParams(): Promise<{ region: string; district: string }[]> {
  const published = await getPublishedSiteIds();
  return [...published].flatMap((id) => {
    const site = getGeoSite(id);
    return site?.kind === "district" ? [{ region: site.region.slug, district: site.district.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, region, district } = await params;
  if (!isLocale(lang)) return {};
  return landingMetadata(await loadLanding(lang, `${region}/${district}`, "district"));
}

/** Лендинг районного (городского) управления полиции */
export default async function DistrictPage({ params }: { params: Promise<Params> }) {
  const { lang, region, district } = await params;
  if (!isLocale(lang)) notFound();
  const landing = await loadLanding(lang, `${region}/${district}`, "district");
  if (!landing) notFound();
  return <TaplinkPage dict={landing.dict} lang={lang} nav={landing.nav} />;
}
