import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import TaplinkPage from "@/components/taplink/TaplinkPage";

/** Фон hero-секции включается автоматически, как только файл появляется в public/ */
const HERO_IMAGE = "/images/hq-building.jpg";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const heroImage = existsSync(join(process.cwd(), "public", HERO_IMAGE))
    ? HERO_IMAGE
    : undefined;

  return <TaplinkPage dict={dict} lang={lang} heroImage={heroImage} />;
}
