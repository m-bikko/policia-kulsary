"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Phone, MapPin, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
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
} from "./sections";

function LangSwitcher({ current }: { current: Locale }) {
  return (
    <nav
      aria-label="Language"
      className="flex items-center gap-1 rounded-full border border-gold-500/20 bg-navy-900/70 p-1"
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}`}
          aria-current={locale === current ? "page" : undefined}
          className={`flex min-h-11 items-center rounded-full px-4 text-[11px] font-bold tracking-widest transition-colors ${
            locale === current
              ? "bg-gold-500 text-navy-950"
              : "text-ink-soft hover:text-gold-300"
          }`}
        >
          {localeLabels[locale].code}
        </Link>
      ))}
    </nav>
  );
}

function ProfileHeader({ dict }: { dict: Dictionary }) {
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
          className="absolute inset-0 -z-10 scale-[1.7] rounded-full bg-gold-500/15 blur-3xl"
        />
        <div className="rounded-full border border-gold-500/40 p-1.5">
          <div className="rounded-full border border-gold-500/70 p-1">
            <Image
              src="/images/logo-mvd.png"
              alt="Эмблема МВД Республики Казахстан"
              width={120}
              height={120}
              priority
              className="rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <h1 className="mt-5 font-display text-xl font-semibold text-ink sm:text-2xl text-balance">
        {dict.header.name}
      </h1>
      <p className="mt-2 text-sm text-ink-soft text-balance">{dict.header.department}</p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-ink-dim">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold-500/80" aria-hidden />
          {dict.header.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-500/80" aria-hidden />
          {dict.header.official}
        </span>
      </div>
    </header>
  );
}

function EmergencyBar({ dict }: { dict: Dictionary }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <a
        href="tel:102"
        className="corner-accents relative flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-gold-500 px-4 py-3 font-display text-navy-950 shadow-[0_8px_28px_-10px_rgba(212,175,55,0.55)] transition-transform active:scale-[0.98]"
      >
        <Phone className="h-5 w-5" aria-hidden />
        <span className="text-lg font-bold tracking-wide">102</span>
        <span className="sr-only">{dict.emergency.police}</span>
      </a>
      <a
        href={`tel:${dict.emergency.dutyPhone.replace(/[^+\d]/g, "")}`}
        className="card-official flex min-h-14 flex-col items-center justify-center rounded-xl px-4 py-2 text-center"
      >
        <span className="text-[11px] uppercase tracking-wider text-ink-dim">
          {dict.emergency.duty}
        </span>
        <span className="mt-0.5 text-sm font-bold text-ink tabular-nums">
          {dict.emergency.dutyPhone}
        </span>
      </a>
      <div className="card-official col-span-2 flex items-center gap-3 rounded-xl px-4 py-3">
        <MapPin className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
        <div className="min-w-0 text-left">
          <p className="text-[11px] uppercase tracking-wider text-ink-dim">
            {dict.emergency.address}
          </p>
          <p className="truncate text-sm font-medium text-ink">
            {dict.emergency.addressValue}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsStrip({ dict }: { dict: Dictionary }) {
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
        <p className="mt-4 text-center text-[10px] text-ink-dim">
          {dict.stats.source}
        </p>
      </div>
    </Reveal>
  );
}

export default function TaplinkPage({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Locale;
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-lg px-4 pb-14 pt-4 sm:px-6">
      <div className="flex justify-end">
        <LangSwitcher current={lang} />
      </div>

      <ProfileHeader dict={dict} />
      <EmergencyBar dict={dict} />
      <StatsStrip dict={dict} />

      <div className="mt-10 flex flex-col gap-10">
        <InfoSection dict={dict} />
        <PointsSection dict={dict} />
        <TrackingSection dict={dict} />
        <RecruitmentSection dict={dict} />
        <UnitsSection dict={dict} />
        <RoadSafetySection dict={dict} />
        <VideoSection dict={dict} />
        <SocialSection dict={dict} />
      </div>

      <SiteFooter dict={dict} />
    </div>
  );
}
