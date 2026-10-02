import { getPortal, getTemplate } from "@/lib/content/get-content";
import { mediaUrl } from "@/lib/content/media";
import { mediaBaseUrl } from "@/lib/supabase/env";
import LanguageSelect from "@/components/splash/LanguageSelect";

/** Трёхъязычная подпись: kz · ru · en (экран показывается до выбора языка) */
const joinLocales = (value: { kz: string; ru: string; en: string }): string =>
  [value.kz, value.ru, value.en].filter((text) => text.trim()).join(" · ");

export default async function SplashPage() {
  const [portal, template] = await Promise.all([getPortal(), getTemplate()]);
  const { splash } = portal;
  return (
    <LanguageSelect
      title={splash.title}
      subtitle={splash.subtitle}
      chooseLabel={splash.chooseLabel}
      footerNote={splash.footerNote}
      logoUrl={mediaUrl(template.media.logo, mediaBaseUrl())}
      logoAlt={template.header.logoAlt.kz || template.header.logoAlt.ru}
      themeToDark={joinLocales(portal.theme.toDark)}
      themeToLight={joinLocales(portal.theme.toLight)}
    />
  );
}
