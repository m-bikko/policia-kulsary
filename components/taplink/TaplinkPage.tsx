"use client";

import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ExternalLink, Phone, MapPin, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import LangSwitcher from "@/components/LangSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { Reveal } from "./primitives";
import {
  InfoSection,
  PointsSection,
  TrackingSection,
  RecruitmentSection,
  UnitsSection,
  RoadSafetySection,
  VideoSection,
  SocialSection,
  SiteFooter,
  RegionDistrictsSection,
  sectionVisible,
  type DistrictLink,
} from "./sections";

/** Навигация лендинга внутри портала: путь, родитель, районы региона */
export type SiteNav = {
  /** Путь без языка: 'atyrau' или 'atyrau/zhylyoi' */
  path: string;
  /** Портал с картой на текущем языке */
  portalHref: string;
  /** Кнопка «назад»: лендинг области или портал с приближенной областью */
  back: { href: string; label: string };
  /** Лендинг области для района (ссылка, если он опубликован) */
  parent?: { label: string; href: string | null };
  /** Районы области - только для лендинга области */
  districts?: DistrictLink[];
  /** Свои адреса переключателя языка (предпросмотр черновика в редакторе) */
  langHrefs?: Record<Locale, string>;
};

function ProfileHeader({ dict, nav }: { dict: Dictionary; nav: SiteNav }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <header className="flex flex-col items-center pt-4 text-center">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-[1.7] rounded-full bg-gold-solid/15 blur-3xl"
        />
        <div className="rounded-full border border-gold-500/40 p-1.5">
          <div className="rounded-full border border-gold-500/70 p-1">
            {dict.media.logo ? (
              <Image
                src={dict.media.logo}
                alt={dict.header.logoAlt}
                width={120}
                height={120}
                priority
                className="rounded-full"
              />
            ) : (
              <span
                role="img"
                aria-label={dict.header.logoAlt}
                className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-navy-800 text-gold-400"
              >
                <ShieldCheck className="h-12 w-12" aria-hidden />
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <h1 className="mt-5 font-display text-xl font-semibold text-ink sm:text-2xl text-balance">
        {dict.header.name}
      </h1>
      {dict.header.department &&
        (nav.parent?.href ? (
          <Link
            href={nav.parent.href}
            className="mt-1 inline-flex min-h-11 items-center px-2 text-sm text-ink-soft underline-offset-4 text-balance transition-colors hover:text-gold-300 hover:underline"
          >
            {dict.header.department}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-ink-soft text-balance">{dict.header.department}</p>
        ))}

      {(dict.header.location || dict.header.official) && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-ink-dim">
          {dict.header.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold-500/80" aria-hidden />
              {dict.header.location}
            </span>
          )}
          {dict.header.official && (
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-500/80" aria-hidden />
              {dict.header.official}
            </span>
          )}
        </div>
      )}
    </header>
  );
}

function EmergencyBar({ dict }: { dict: Dictionary }) {
  const { emergency } = dict;
  const dutyHref = emergency.dutyPhone.replace(/[^+\d]/g, "");
  const addressLink = dict.points.headquarters.maps.google || dict.points.headquarters.maps.twoGis;
  const addressBody = (
    <>
      <MapPin className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[11px] uppercase tracking-wider text-ink-dim">{emergency.address}</p>
        <p className="text-sm font-medium leading-snug text-ink">{emergency.addressValue}</p>
      </div>
    </>
  );
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <a
        href="tel:102"
        className={`corner-accents relative flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-gold-solid px-4 py-3 font-display text-on-gold shadow-[0_8px_28px_-10px_rgba(212,175,55,0.55)] transition-transform active:scale-[0.98] ${dutyHref ? "" : "col-span-2"}`}
      >
        <Phone className="h-5 w-5" aria-hidden />
        <span className="text-lg font-bold tracking-wide">102</span>
        <span className="sr-only">{emergency.police}</span>
      </a>
      {dutyHref && (
        <a
          href={`tel:${dutyHref}`}
          className="card-official flex min-h-14 flex-col items-center justify-center rounded-xl px-4 py-2 text-center"
        >
          <span className="text-[11px] uppercase tracking-wider text-ink-dim">{emergency.duty}</span>
          <span className="mt-0.5 text-sm font-bold text-ink tabular-nums">{emergency.dutyPhone}</span>
        </a>
      )}
      {emergency.chief.name && (
        <div className="card-official corner-accents col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl px-4 py-3.5">
          <div className="min-w-0 flex-1 basis-52 text-left">
            <p className="text-[11px] uppercase tracking-wider text-ink-dim">{emergency.chief.label}</p>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-ink">{emergency.chief.name}</p>
          </div>
          {emergency.chief.phoneRaw && (
            <a
              href={`tel:${emergency.chief.phoneRaw}`}
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3.5 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500/20"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">{emergency.chief.phone}</span>
            </a>
          )}
        </div>
      )}
      {emergency.addressValue &&
        (addressLink ? (
          <a
            href={addressLink}
            target="_blank"
            rel="noopener noreferrer"
            className="card-official group col-span-2 flex items-center gap-3 rounded-xl px-4 py-3"
          >
            {addressBody}
            <ExternalLink
              className="h-4 w-4 shrink-0 text-gold-500/50 transition-colors group-hover:text-gold-400"
              aria-hidden
            />
          </a>
        ) : (
          <div className="card-official col-span-2 flex items-center gap-3 rounded-xl px-4 py-3">
            {addressBody}
          </div>
        ))}
    </div>
  );
}

function StatsStrip({ dict }: { dict: Dictionary }) {
  if (dict.stats.items.length === 0) return null;
  return (
    <Reveal className="mt-8">
      <div className="card-official corner-accents rounded-2xl px-5 py-5">
        <p className="gold-divider text-[11px] font-bold uppercase tracking-[0.22em]">
          {dict.stats.heading}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
          {dict.stats.items.map((item) => (
            <div key={item.label} className="text-center">
              <dd className="font-display text-xl font-bold text-gold-400 tabular-nums sm:text-2xl">
                {item.value}
              </dd>
              <dt className="mt-1 text-xs leading-snug text-ink-soft">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
        {dict.stats.source && (
          <p className="mt-4 text-center text-xs text-ink-dim">{dict.stats.source}</p>
        )}
      </div>
    </Reveal>
  );
}

type SectionEntry = { key: string; render: (n: string) => ReactNode };

/** Секции лендинга в порядке показа; пустые (без данных) не выводятся и не занимают номер */
function visibleSections(dict: Dictionary, nav: SiteNav): SectionEntry[] {
  const entries: (SectionEntry | false)[] = [
    Boolean(nav.districts?.length) && {
      key: "districts",
      render: (n) => <RegionDistrictsSection dict={dict} n={n} districts={nav.districts ?? []} />,
    },
    sectionVisible.info(dict) && { key: "info", render: (n) => <InfoSection dict={dict} n={n} /> },
    sectionVisible.points(dict) && { key: "points", render: (n) => <PointsSection dict={dict} n={n} /> },
    sectionVisible.tracking(dict) && { key: "tracking", render: (n) => <TrackingSection dict={dict} n={n} /> },
    sectionVisible.recruitment(dict) && {
      key: "recruitment",
      render: (n) => <RecruitmentSection dict={dict} n={n} />,
    },
    sectionVisible.units(dict) && { key: "units", render: (n) => <UnitsSection dict={dict} n={n} /> },
    sectionVisible.roadSafety(dict) && {
      key: "roadSafety",
      render: (n) => <RoadSafetySection dict={dict} n={n} />,
    },
    sectionVisible.video(dict) && { key: "video", render: (n) => <VideoSection dict={dict} n={n} /> },
    sectionVisible.social(dict) && { key: "social", render: (n) => <SocialSection dict={dict} n={n} /> },
  ];
  return entries.filter((entry): entry is SectionEntry => entry !== false);
}

/** Лендинг одного подразделения (область или район) - общий дизайн для всех участков */
export default function TaplinkPage({
  dict,
  lang,
  nav,
}: {
  dict: Dictionary;
  lang: Locale;
  nav: SiteNav;
}) {
  const heroImage = dict.media.heroBackground;
  const sections = visibleSections(dict, nav);
  return (
    <div className="relative z-10 mx-auto w-full max-w-lg px-4 pb-14 sm:px-6">
      <div className="relative -mx-4 px-4 pb-4 pt-4 sm:-mx-6 sm:px-6">
        {heroImage && (
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/85 to-navy-950" />
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <Link
            href={nav.back.href}
            aria-label={nav.back.label}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-navy-900/70 text-ink-soft transition-colors hover:text-gold-300"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle labelToDark={dict.theme.toDark} labelToLight={dict.theme.toLight} />
            <LangSwitcher current={lang} path={nav.path} hrefs={nav.langHrefs} />
          </div>
        </div>

        <ProfileHeader dict={dict} nav={nav} />
      </div>

      <EmergencyBar dict={dict} />
      <StatsStrip dict={dict} />

      {sections.length > 0 && (
        <div className="mt-10 flex flex-col gap-10">
          {sections.map((section, index) => (
            <Fragment key={section.key}>{section.render(String(index + 1).padStart(2, "0"))}</Fragment>
          ))}
        </div>
      )}

      <SiteFooter dict={dict} portalHref={nav.portalHref} />
    </div>
  );
}
