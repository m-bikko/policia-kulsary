import { locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import type { Localized } from "./schema-dsl";
import type { Content } from "./schema";
import { mediaUrl, toTelHref } from "./media";

/** Текст на нужном языке; пустой перевод подменяется другим языком (kz, ru, en) */
export function pickLocale(value: Localized, locale: Locale): string {
  for (const l of [locale, ...locales.filter((other) => other !== locale)]) if (value[l].trim()) return value[l];
  return "";
}

/**
 * Собирает из общего контента словарь одного языка - ровно в той форме,
 * которую ждут компоненты сайта. Пустой перевод подменяется другим языком
 * (сначала kz, затем ru, en), чтобы новый текст, введённый пока только
 * на одном языке, не оставлял на сайте пустых мест.
 */
export function resolveDictionary(
  content: Content,
  locale: Locale,
  mediaBase: string,
): Dictionary {
  const s = (value: Localized): string => pickLocale(value, locale);
  const opt = (value: string): string | undefined => (value.trim() ? value : undefined);
  const img = (path: string): string => mediaUrl(path, mediaBase);
  const c = content;

  return {
    // Пустой заголовок вкладки - название управления (черновик ещё не заполнен)
    meta: { title: s(c.meta.title) || s(c.header.name), description: s(c.meta.description) },
    theme: { toDark: s(c.theme.toDark), toLight: s(c.theme.toLight) },
    media: { logo: img(c.media.logo), heroBackground: img(c.media.heroBackground) },
    header: {
      name: s(c.header.name),
      department: s(c.header.department),
      location: s(c.header.location),
      official: s(c.header.official),
      logoAlt: s(c.header.logoAlt),
    },
    emergency: {
      police: s(c.emergency.police),
      duty: s(c.emergency.duty),
      dutyPhone: c.emergency.dutyPhone,
      chief: {
        label: s(c.emergency.chief.label),
        name: s(c.emergency.chief.name),
        phone: c.emergency.chief.phone,
        phoneRaw: toTelHref(c.emergency.chief.phone),
      },
      address: s(c.emergency.address),
      addressValue: s(c.emergency.addressValue),
    },
    stats: {
      heading: s(c.stats.heading),
      items: c.stats.items.map((item) => ({ value: item.value, label: s(item.label) })),
      source: s(c.stats.source),
    },
    info: {
      title: s(c.info.title),
      subtitle: s(c.info.subtitle),
      paragraphs: c.info.paragraphs.map(s).filter(Boolean),
      wikipedia: s(c.info.wikipedia),
      wikipediaUrl: s(c.info.wikipediaUrl),
      govPortal: s(c.info.govPortal),
      govPortalUrl: s(c.info.govPortalUrl),
    },
    points: {
      title: s(c.points.title),
      subtitle: s(c.points.subtitle),
      headquarters: {
        name: s(c.points.headquarters.name),
        note: s(c.points.headquarters.note),
        maps: {
          twoGis: c.points.headquarters.twoGis,
          google: c.points.headquarters.google,
        },
      },
      open2gis: s(c.points.open2gis),
      openGoogle: s(c.points.openGoogle),
      openList: s(c.points.openList),
      modalTitle: s(c.points.modalTitle),
      close: s(c.points.close),
      groups: c.points.groups.map((group) => ({
        label: s(group.label),
        points: group.points.map((point) => ({
          name: s(point.name),
          address: opt(s(point.address)),
          inspector: opt(s(point.inspector)),
          photo: opt(img(point.photo)),
          phone: opt(point.phone),
          phoneRaw: opt(toTelHref(point.phone)),
          twoGis: opt(point.twoGis),
          google: opt(point.google),
        })),
      })),
    },
    tracking: {
      title: s(c.tracking.title),
      subtitle: s(c.tracking.subtitle),
      photoHint: s(c.tracking.photoHint),
      close: s(c.tracking.close),
      devices: c.tracking.devices.map((device) => ({
        title: s(device.title),
        description: s(device.description),
        images: device.images
          .map((image) => ({ src: img(image.src), caption: s(image.caption) }))
          .filter((image) => image.src),
        link: device.link.href
          ? { href: device.link.href, label: s(device.link.label) || device.link.href }
          : undefined,
      })),
    },
    recruitment: {
      title: s(c.recruitment.title),
      subtitle: s(c.recruitment.subtitle),
      detailsLabel: s(c.recruitment.detailsLabel),
      modalTitle: s(c.recruitment.modalTitle),
      close: s(c.recruitment.close),
      noTestNote: s(c.recruitment.noTestNote),
      benefitsTitle: s(c.recruitment.benefitsTitle),
      benefits: c.recruitment.benefits.map(s).filter(Boolean),
      requirementsTitle: s(c.recruitment.requirementsTitle),
      requirements: c.recruitment.requirements.map(s).filter(Boolean),
      documentsTitle: s(c.recruitment.documentsTitle),
      documents: c.recruitment.documents.map(s).filter(Boolean),
      downloadLabel: s(c.recruitment.downloadLabel),
      downloadUrl: s(c.recruitment.downloadUrl),
      infoLabel: s(c.recruitment.infoLabel),
      infoUrl: s(c.recruitment.infoUrl),
      contactLabel: s(c.recruitment.contactLabel),
      contactAddress: s(c.recruitment.contactAddress),
      contactPhone: c.recruitment.contactPhone,
      contactPhoneRaw: toTelHref(c.recruitment.contactPhone),
    },
    units: {
      title: s(c.units.title),
      subtitle: s(c.units.subtitle),
      officerLabel: s(c.units.officerLabel),
      items: c.units.items.map((unit) => ({
        title: s(unit.title),
        description: s(unit.description),
        officer: s(unit.officer.name)
          ? {
              name: s(unit.officer.name),
              photo: opt(img(unit.officer.photo)),
              phone: opt(unit.officer.phone),
              phoneRaw: opt(toTelHref(unit.officer.phone)),
            }
          : undefined,
      })),
    },
    roadSafety: {
      title: s(c.roadSafety.title),
      subtitle: s(c.roadSafety.subtitle),
      body: c.roadSafety.body.map(s).filter(Boolean),
      infoLabel: s(c.roadSafety.infoLabel),
    },
    video: {
      title: s(c.video.title),
      subtitle: s(c.video.subtitle),
      watchLabel: s(c.video.watchLabel),
      url: c.video.url,
    },
    social: {
      title: s(c.social.title),
      subtitle: s(c.social.subtitle),
      instagram: c.social.instagram,
      facebook: c.social.facebook,
      tiktok: c.social.tiktok,
      comingSoon: s(c.social.comingSoon),
    },
    regionDistricts: {
      title: s(c.regionDistricts.title),
      subtitle: s(c.regionDistricts.subtitle),
      comingSoon: s(c.regionDistricts.comingSoon),
    },
    footer: {
      org: s(c.footer.org) || s(c.header.name),
      disclaimer: s(c.footer.disclaimer),
      portalLink: s(c.footer.portalLink),
    },
  };
}
