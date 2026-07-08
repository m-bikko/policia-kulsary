"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  BookOpen,
  Camera,
  Car,
  ChevronRight,
  Download,
  Drone,
  ExternalLink,
  FileText,
  Globe,
  IdCard,
  Landmark,
  MapPin,
  Phone,
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
import type { PolicePoint, TrackingDevice, Unit } from "@/lib/i18n/types";
import { Reveal, SectionTitle, Collapsible, Modal } from "./primitives";

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

function PointRow({ point, dict }: { point: PolicePoint; dict: Dictionary }) {
  return (
    <div className="rounded-xl border border-gold-500/15 bg-navy-900/60 px-4 py-3.5">
      <p className="text-sm font-semibold text-ink">{point.name}</p>
      {point.address && (
        <p className="mt-1 flex items-start gap-1.5 text-xs text-ink-soft">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500/70" aria-hidden />
          {point.address}
        </p>
      )}
      {point.inspector && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
          {point.inspector}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {point.phone && point.phoneRaw && (
          <a
            href={`tel:${point.phoneRaw}`}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/20"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="tabular-nums">{point.phone}</span>
          </a>
        )}
        {point.twoGis && (
          <a
            href={point.twoGis}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center rounded-lg border border-gold-500/25 px-3 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-400/60 hover:bg-gold-500/10"
          >
            {dict.points.open2gis}
          </a>
        )}
        {point.google && (
          <a
            href={point.google}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center rounded-lg border border-navy-600 px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-gold-500/40 hover:text-gold-300"
          >
            {dict.points.openGoogle}
          </a>
        )}
      </div>
    </div>
  );
}

export function PointsSection({ dict }: { dict: Dictionary }) {
  const { points } = dict;
  const [open, setOpen] = useState(false);
  const hq = points.headquarters;

  return (
    <Reveal aria-labelledby="s-points">
      <SectionTitle overline="02" title={points.title} id="s-points" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{points.subtitle}</p>
      <div className="flex flex-col gap-3">
        <div className="card-official corner-accents rounded-2xl border-gold-500/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{hq.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{hq.note}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={hq.maps.twoGis}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center rounded-lg border border-gold-500/25 px-3 py-2 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-400/60 hover:bg-gold-500/10"
            >
              {points.open2gis}
            </a>
            <a
              href={hq.maps.google}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center rounded-lg border border-navy-600 px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-gold-500/40 hover:text-gold-300"
            >
              {points.openGoogle}
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="card-official group flex min-h-14 w-full cursor-pointer items-center gap-3.5 rounded-2xl px-5 py-4 text-left"
        >
          <span className="shrink-0 text-gold-400">
            <Landmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">
              {points.openList}
            </span>
            <span className="mt-0.5 block text-xs text-ink-soft">
              {points.groups.map((g) => g.label).join(" · ")}
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-gold-500/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gold-400"
            aria-hidden
          />
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={points.modalTitle}
        closeLabel={points.close}
      >
        <div className="flex flex-col gap-5">
          {points.groups.map((group) => (
            <div key={group.label}>
              <p className="gold-divider text-[11px] font-bold uppercase tracking-[0.18em]">
                {group.label}
              </p>
              <div className="mt-3 flex flex-col gap-2.5">
                {group.points.map((point) => (
                  <PointRow key={point.name} point={point} dict={dict} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </Reveal>
  );
}

/* ── Системы отслеживания ───────────────────────────────────── */

function DeviceCard({
  device,
  icon,
  dict,
  className = "",
}: {
  device: TrackingDevice;
  icon: ReactNode;
  dict: Dictionary;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasPhotos = Boolean(device.images?.length);

  const body = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
        {icon}
      </span>
      <h3 className="mt-3.5 font-display text-base font-semibold text-ink">
        {device.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {device.description}
      </p>
    </>
  );

  if (!hasPhotos) {
    return (
      <div
        className={`card-official corner-accents flex flex-col rounded-2xl px-5 py-5 ${className}`}
      >
        {body}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`card-official corner-accents group flex w-full cursor-pointer flex-col rounded-2xl px-5 py-5 text-left ${className}`}
      >
        {body}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 transition-colors group-hover:text-gold-400">
          <Camera className="h-3.5 w-3.5" aria-hidden />
          {dict.tracking.photoHint}
        </span>
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={device.title}
        closeLabel={dict.tracking.close}
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          {device.description}
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {device.images?.map((img) => (
            <figure key={img.src}>
              <Image
                src={img.src}
                alt={img.caption}
                width={1280}
                height={720}
                sizes="(max-width: 640px) 100vw, 512px"
                className="h-auto w-full rounded-xl border border-gold-500/15"
              />
              <figcaption className="mt-1.5 text-xs text-ink-dim">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Modal>
    </>
  );
}

export function TrackingSection({ dict }: { dict: Dictionary }) {
  const { tracking } = dict;
  const icons = [
    <Drone key="drone" className="h-6 w-6" aria-hidden />,
    <Car key="cyber" className="h-6 w-6" aria-hidden />,
    <Radar key="radar" className="h-6 w-6" aria-hidden />,
  ];
  return (
    <Reveal aria-labelledby="s-tracking">
      <SectionTitle overline="03" title={tracking.title} id="s-tracking" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{tracking.subtitle}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {tracking.devices.map((device, i) => (
          <DeviceCard
            key={device.title}
            device={device}
            icon={icons[i]}
            dict={dict}
            className={i === tracking.devices.length - 1 ? "sm:col-span-2" : ""}
          />
        ))}
      </div>
    </Reveal>
  );
}

/* ── Приём на службу ────────────────────────────────────────── */

export function RecruitmentSection({ dict }: { dict: Dictionary }) {
  const { recruitment } = dict;
  const [open, setOpen] = useState(false);

  return (
    <Reveal aria-labelledby="s-recruitment">
      <SectionTitle overline="04" title={recruitment.title} id="s-recruitment" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{recruitment.subtitle}</p>
      <div className="flex flex-col gap-3">
        <div className="card-official corner-accents rounded-2xl px-5 py-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden />
            <p className="text-sm leading-relaxed text-ink-soft">
              {recruitment.noTestNote}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="card-official group flex min-h-14 w-full cursor-pointer items-center gap-3.5 rounded-2xl px-5 py-4 text-left"
        >
          <span className="shrink-0 text-gold-400">
            <UserCheck className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">
              {recruitment.detailsLabel}
            </span>
            <span className="mt-0.5 block text-xs text-ink-soft">
              {recruitment.benefitsTitle} · {recruitment.requirementsTitle} ·{" "}
              {recruitment.documentsTitle}
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-gold-500/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gold-400"
            aria-hidden
          />
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={recruitment.modalTitle}
        closeLabel={recruitment.close}
      >
        <div className="flex flex-col gap-6">
          <p className="rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-sm leading-relaxed text-ink-soft">
            {recruitment.noTestNote}
          </p>

          <section>
            <p className="gold-divider text-[11px] font-bold uppercase tracking-[0.18em]">
              {recruitment.benefitsTitle}
            </p>
            <ul className="mt-3 space-y-2.5">
              {recruitment.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-400"
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="gold-divider text-[11px] font-bold uppercase tracking-[0.18em]">
              {recruitment.requirementsTitle}
            </p>
            <ul className="mt-3 space-y-2.5">
              {recruitment.requirements.map((req) => (
                <li
                  key={req}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                >
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70"
                    aria-hidden
                  />
                  {req}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="gold-divider text-[11px] font-bold uppercase tracking-[0.18em]">
              {recruitment.documentsTitle}
            </p>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-relaxed text-ink-soft marker:text-gold-500/70">
              {recruitment.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-2.5">
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
          </section>

          <section className="rounded-xl border border-gold-500/15 bg-navy-900/60 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
              {recruitment.contactLabel}
            </p>
            <div className="mt-3 flex items-start gap-2.5 text-sm text-ink-soft">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              {recruitment.contactAddress}
            </div>
            <a
              href={`tel:${recruitment.contactPhoneRaw}`}
              className="mt-3 flex min-h-11 items-center justify-center gap-2.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500/20"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">{recruitment.contactPhone}</span>
            </a>
          </section>
        </div>
      </Modal>
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
  const [staffOpen, setStaffOpen] = useState(false);
  const staff = dict.points.groups
    .flatMap((group) => group.points)
    .filter((point) => point.inspector);

  const unitCardBody = (unit: Unit, i: number) => (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
        {unitIcons[i]}
      </span>
      <h3 className="mt-3.5 text-sm font-bold text-ink">{unit.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
        {unit.description}
      </p>
    </>
  );

  return (
    <Reveal aria-labelledby="s-units">
      <SectionTitle overline="05" title={units.title} id="s-units" />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">{units.subtitle}</p>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {units.items.map((unit, i) =>
          i === 0 ? (
            <button
              key={unit.title}
              type="button"
              onClick={() => setStaffOpen(true)}
              className="card-official group flex w-full cursor-pointer flex-col rounded-2xl px-5 py-5 text-left"
            >
              {unitCardBody(unit, i)}
              <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-gold-300 transition-colors group-hover:text-gold-400">
                {units.staffTitle}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </button>
          ) : (
            <div
              key={unit.title}
              className="card-official flex flex-col rounded-2xl px-5 py-5"
            >
              {unitCardBody(unit, i)}
            </div>
          ),
        )}
      </div>

      <Modal
        open={staffOpen}
        onClose={() => setStaffOpen(false)}
        title={units.staffTitle}
        closeLabel={units.close}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
          {units.staffNote}
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          {staff.map((member) => (
            <div
              key={`${member.name}-${member.inspector}`}
              className="rounded-xl border border-gold-500/15 bg-navy-900/60 px-4 py-3.5"
            >
              <p className="text-sm font-semibold text-ink">{member.inspector}</p>
              <p className="mt-1 text-xs text-ink-dim">{member.name}</p>
              {member.phone && member.phoneRaw && (
                <a
                  href={`tel:${member.phoneRaw}`}
                  className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/20"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  <span className="tabular-nums">{member.phone}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </Modal>
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
              <span className="rounded-full border border-gold-500/25 px-2 py-0.5 text-xs text-gold-500/70">
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
