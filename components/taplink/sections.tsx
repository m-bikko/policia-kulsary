"use client";

import type { ReactNode } from "react";
import {
  BookOpen,
  Camera,
  Car,
  Download,
  Drone,
  ExternalLink,
  FileText,
  Globe,
  IdCard,
  MapPin,
  Play,
  Radar,
  ScrollText,
  Send,
  ShieldCheck,
  Siren,
  TriangleAlert,
  UserCheck,
  Users,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { SupportPoint } from "@/lib/i18n/types";
import { Reveal, SectionTitle, Collapsible } from "./primitives";

function ExternalCard({
  href,
  icon,
  title,
  note,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-official group flex min-h-14 items-center gap-3.5 rounded-2xl px-5 py-4"
    >
      <span className="shrink-0 text-gold-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {note && <span className="mt-0.5 block text-xs text-ink-soft">{note}</span>}
      </span>
      <ExternalLink
        className="h-4 w-4 shrink-0 text-gold-500/50 transition-colors group-hover:text-gold-400"
        aria-hidden
      />
    </a>
  );
}

/* ── Информация ─────────────────────────────────────────────── */

export function InfoSection({ dict }: { dict: Dictionary }) {
  const { info } = dict;
  return (
    <Reveal aria-labelledby="s-info">
      <SectionTitle overline="01" title={info.title} id="s-info" />
      <div className="card-official corner-accents rounded-2xl px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
          {info.subtitle}
        </p>
        <div className="mt-3 space-y-3">
          {info.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <ExternalCard
          href={info.wikipediaUrl}
          icon={<BookOpen className="h-5 w-5" aria-hidden />}
          title={info.wikipedia}
        />
        <ExternalCard
          href={info.govPortalUrl}
          icon={<Globe className="h-5 w-5" aria-hidden />}
          title={info.govPortal}
        />
      </div>
    </Reveal>
  );
}

/* ── Опорные пункты ─────────────────────────────────────────── */

function PointCard({
  point,
  dict,
  highlight = false,
}: {
  point: SupportPoint;
  dict: Dictionary;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card-official rounded-2xl px-5 py-4 ${
        highlight ? "corner-accents border-gold-500/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{point.name}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{point.note}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={point.maps.twoGis}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center rounded-lg border border-gold-500/25 px-3 py-2 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-400/60 hover:bg-gold-500/10"
        >
          {dict.points.open2gis}
        </a>
        <a
          href={point.maps.google}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center rounded-lg border border-navy-600 px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-gold-500/40 hover:text-gold-300"
        >
          {dict.points.openGoogle}
        </a>
      </div>
    </div>
  );
}

export function PointsSection({ dict }: { dict: Dictionary }) {
  const { points } = dict;
  return (
    <Reveal aria-labelledby="s-points">
      <SectionTitle overline="02" title={points.title} id="s-points" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{points.subtitle}</p>
      <div className="flex flex-col gap-3">
        <PointCard point={points.headquarters} dict={dict} highlight />
        <div className="grid gap-3 sm:grid-cols-2">
          {points.items.map((point) => (
            <PointCard key={point.name} point={point} dict={dict} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ── Системы отслеживания ───────────────────────────────────── */

export function TrackingSection({ dict }: { dict: Dictionary }) {
  const { tracking } = dict;
  const cards = [
    { data: tracking.drones, icon: <Drone className="h-6 w-6" aria-hidden /> },
    { data: tracking.radar, icon: <Radar className="h-6 w-6" aria-hidden /> },
  ];
  return (
    <Reveal aria-labelledby="s-tracking">
      <SectionTitle overline="03" title={tracking.title} id="s-tracking" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{tracking.subtitle}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ data, icon }) => (
          <div
            key={data.title}
            className="card-official corner-accents flex flex-col rounded-2xl px-5 py-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
              {icon}
            </span>
            <h3 className="mt-3.5 font-display text-base font-semibold text-ink">
              {data.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
              {data.description}
            </p>
            <ul className="mt-3 space-y-1.5">
              {data.facts.map((fact) => (
                <li
                  key={fact}
                  className="flex items-center gap-2 text-xs font-medium text-gold-300"
                >
                  <span aria-hidden className="h-1 w-1 rounded-full bg-gold-400" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ── Приём на службу ────────────────────────────────────────── */

export function RecruitmentSection({ dict }: { dict: Dictionary }) {
  const { recruitment } = dict;
  return (
    <Reveal aria-labelledby="s-recruitment">
      <SectionTitle overline="04" title={recruitment.title} id="s-recruitment" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{recruitment.subtitle}</p>
      <div className="flex flex-col gap-3">
        <Collapsible
          icon={<UserCheck className="h-5 w-5" aria-hidden />}
          summary={recruitment.requirementsTitle}
          defaultOpen
        >
          <ul className="space-y-2.5">
            {recruitment.requirements.map((req) => (
              <li key={req} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70"
                  aria-hidden
                />
                {req}
              </li>
            ))}
          </ul>
        </Collapsible>
        <Collapsible
          icon={<FileText className="h-5 w-5" aria-hidden />}
          summary={recruitment.documentsTitle}
        >
          <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-ink-soft marker:text-gold-500/70">
            {recruitment.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ol>
        </Collapsible>
        <ExternalCard
          href={recruitment.downloadUrl}
          icon={<Download className="h-5 w-5" aria-hidden />}
          title={recruitment.downloadLabel}
        />
        <ExternalCard
          href={recruitment.infoUrl}
          icon={<ScrollText className="h-5 w-5" aria-hidden />}
          title={recruitment.infoLabel}
        />
      </div>
    </Reveal>
  );
}

/* ── Подразделения ──────────────────────────────────────────── */

const unitIcons = [
  <Siren key="patrol" className="h-6 w-6" aria-hidden />,
  <IdCard key="migration" className="h-6 w-6" aria-hidden />,
  <Users key="precinct" className="h-6 w-6" aria-hidden />,
  <Car key="highway" className="h-6 w-6" aria-hidden />,
];

export function UnitsSection({ dict }: { dict: Dictionary }) {
  const { units } = dict;
  return (
    <Reveal aria-labelledby="s-units">
      <SectionTitle overline="05" title={units.title} id="s-units" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{units.subtitle}</p>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {units.items.map((unit, i) => (
          <div
            key={unit.title}
            className="card-official flex flex-col rounded-2xl px-5 py-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
              {unitIcons[i]}
            </span>
            <h3 className="mt-3.5 text-sm font-bold text-ink">{unit.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              {unit.description}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ── Аварийные участки ──────────────────────────────────────── */

export function RoadSafetySection({ dict }: { dict: Dictionary }) {
  const { roadSafety } = dict;
  return (
    <Reveal aria-labelledby="s-road">
      <SectionTitle overline="06" title={roadSafety.title} id="s-road" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{roadSafety.subtitle}</p>
      <Collapsible
        icon={<TriangleAlert className="h-5 w-5" aria-hidden />}
        summary={roadSafety.infoLabel}
        defaultOpen
      >
        <div className="space-y-3">
          {roadSafety.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </Collapsible>
    </Reveal>
  );
}

/* ── Видео ──────────────────────────────────────────────────── */

export function VideoSection({ dict }: { dict: Dictionary }) {
  const { video } = dict;
  return (
    <Reveal aria-labelledby="s-video">
      <SectionTitle overline="07" title={video.title} id="s-video" />
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-official corner-accents group relative flex min-h-36 flex-col items-center justify-center overflow-hidden rounded-2xl px-5 py-8 text-center"
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.10),transparent_65%)]"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/15 text-gold-300 transition-transform duration-200 group-hover:scale-105">
          <Play className="ml-0.5 h-6 w-6" aria-hidden />
        </span>
        <span className="relative mt-4 text-sm font-semibold text-ink">
          {video.subtitle}
        </span>
        <span className="relative mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
          <Camera className="h-3.5 w-3.5" aria-hidden />
          {video.watchLabel}
        </span>
      </a>
    </Reveal>
  );
}

/* ── Соцсети ────────────────────────────────────────────────── */

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function SocialSection({ dict }: { dict: Dictionary }) {
  const { social } = dict;
  const links = [
    { name: "Instagram", href: social.instagram, icon: <InstagramIcon /> },
    { name: "Facebook", href: social.facebook, icon: <FacebookIcon /> },
    { name: "Telegram", href: social.telegram, icon: <Send className="h-5 w-5" aria-hidden /> },
    { name: "TikTok", href: social.tiktok, icon: <TikTokIcon /> },
  ];
  return (
    <Reveal aria-labelledby="s-social">
      <SectionTitle overline="08" title={social.title} id="s-social" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{social.subtitle}</p>
      <div className="grid grid-cols-2 gap-3">
        {links.map((link) =>
          link.href ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-official flex min-h-13 items-center justify-center gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink transition-colors hover:text-gold-300"
            >
              <span className="text-gold-400">{link.icon}</span>
              {link.name}
            </a>
          ) : (
            <div
              key={link.name}
              aria-disabled="true"
              className="card-official flex min-h-13 items-center justify-center gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink-dim opacity-60"
            >
              <span>{link.icon}</span>
              {link.name}
              <span className="rounded-full border border-gold-500/25 px-2 py-0.5 text-[10px] text-gold-500/70">
                {social.comingSoon}
              </span>
            </div>
          ),
        )}
      </div>
    </Reveal>
  );
}

/* ── Футер ──────────────────────────────────────────────────── */

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-14 border-t border-gold-500/15 pt-6 text-center">
      <p className="text-xs leading-relaxed text-ink-dim">{dict.footer.org}</p>
      <p className="mt-2 text-xs font-semibold text-gold-500/80">
        {dict.footer.disclaimer}
      </p>
      <a
        href="/"
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 px-4 text-xs text-ink-dim underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
      >
        <Globe className="h-3.5 w-3.5" aria-hidden />
        {dict.footer.backToLang}
      </a>
    </footer>
  );
}
