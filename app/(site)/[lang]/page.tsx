import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import TaplinkPage from "@/components/taplink/TaplinkPage";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return <TaplinkPage dict={dict} lang={lang} />;
}
