import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/content/get-dictionary";
import TaplinkPage from "@/components/taplink/TaplinkPage";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return <TaplinkPage dict={dict} lang={lang} />;
}
