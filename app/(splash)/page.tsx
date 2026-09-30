import { getContent } from "@/lib/content/get-content";
import { mediaUrl } from "@/lib/content/media";
import { mediaBaseUrl } from "@/lib/supabase/env";
import LanguageSelect from "@/components/splash/LanguageSelect";

/** Трёхъязычная подпись: kz · ru · en (экран показывается до выбора языка) */
const joinLocales = (value: { kz: string; ru: string; en: string }): string =>
  [value.kz, value.ru, value.en].filter((text) => text.trim()).join(" · ");

export default async function SplashPage() {
  const content = await getContent();
  const { splash } = content;
  return (
    <LanguageSelect
      title={splash.title}
      subtitle={splash.subtitle}
      chooseLabel={splash.chooseLabel}
      footerNote={splash.footerNote}
      logoUrl={mediaUrl(content.media.logo, mediaBaseUrl())}
      logoAlt={content.header.logoAlt.kz || content.header.logoAlt.ru}
      themeToDark={joinLocales(content.theme.toDark)}
      themeToLight={joinLocales(content.theme.toLight)}
    />
  );
}
