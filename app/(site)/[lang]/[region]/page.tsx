import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getRegion } from "@/lib/geo/kz";
import { getPublishedSiteIds } from "@/lib/content/get-content";
import { landingMetadata, loadLanding } from "@/lib/content/landing";
import TaplinkPage from "@/components/taplink/TaplinkPage";

type Params = { lang: string; region: string };

/** На сборке - только опубликованные лендинги областей; остальные рендерятся по запросу */
export async function generateStaticParams(): Promise<{ region: string }[]> {
  const published = await getPublishedSiteIds();
  return [...published].filter((id) => getRegion(id)).map((region) => ({ region }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, region } = await params;
  if (!isLocale(lang)) return {};
  return landingMetadata(await loadLanding(lang, region, "region"));
}

/** Лендинг департамента полиции области или города республиканского значения */
export default async function RegionPage({ params }: { params: Promise<Params> }) {
  const { lang, region } = await params;
  if (!isLocale(lang)) notFound();
  const landing = await loadLanding(lang, region, "region");
  if (!landing) notFound();
  return <TaplinkPage dict={landing.dict} lang={lang} nav={landing.nav} />;
}
