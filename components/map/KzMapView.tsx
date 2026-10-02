"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n/config";

/** Минимальные данные карты для отрисовки (передаются с сервера) */
export type MapRegion = { slug: string; name: Record<Locale, string>; path: string; bbox: number[] };
export type MapDistrict = MapRegion & { id: string; region: string };

/** Состояние лендинга: опубликован, черновик или (на публичном портале) недоступен */
export type MapSiteState = "published" | "draft";

type Props = {
  viewBox: number[];
  regions: MapRegion[];
  districts: MapDistrict[];
  locale: Locale;
  /** Состояние лендингов по id ('atyrau', 'atyrau/zhylyoi'); отсутствует = недоступен */
  states: Record<string, MapSiteState>;
  selectedRegion: string | null;
  selectedSiteId?: string | null;
  onSelectRegion: (slug: string | null) => void;
  onSelectDistrict: (id: string) => void;
  /** Подпись карты для скринридеров */
  label: string;
  attribution: string;
};

const PADDING = 0.08;

/** Масштаб и сдвиг группы, чтобы bbox заполнил кадр (с полями) */
function zoomTo(bbox: number[], viewBox: number[]): { scale: number; x: number; y: number } {
  const [, , width, height] = viewBox;
  const [x0, y0, x1, y1] = bbox;
  const w = Math.max(x1 - x0, 1);
  const h = Math.max(y1 - y0, 1);
  const scale = Math.min(width / (w * (1 + PADDING * 2)), height / (h * (1 + PADDING * 2)), 12);
  const x = width / 2 - ((x0 + x1) / 2) * scale;
  const y = height / 2 - ((y0 + y1) / 2) * scale;
  return { scale, x, y };
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

/**
 * Интерактивная карта Казахстана (SVG, без картографических библиотек).
 * Без выбора - регионы; выбран регион - карта приближается и показывает его районы.
 * Цвет: золотой - есть опубликованный лендинг, приглушённый - готовится.
 */
export default function KzMapView({
  viewBox,
  regions,
  districts,
  locale,
  states,
  selectedRegion,
  selectedSiteId = null,
  onSelectRegion,
  onSelectDistrict,
  label,
  attribution,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);

  const region = selectedRegion ? regions.find((item) => item.slug === selectedRegion) ?? null : null;
  const transform = region ? zoomTo(region.bbox, viewBox) : { scale: 1, x: 0, y: 0 };
  const visibleDistricts = useMemo(
    () => (selectedRegion ? districts.filter((district) => district.region === selectedRegion) : []),
    [districts, selectedRegion],
  );

  // Регион «активен», если опубликован он сам или хотя бы один его район
  const regionActive = useMemo(() => {
    const active = new Set<string>();
    for (const item of regions) if (states[item.slug] === "published") active.add(item.slug);
    for (const district of districts) if (states[district.id] === "published") active.add(district.region);
    return active;
  }, [regions, districts, states]);

  const track = (event: PointerEvent, name: string) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setHover({ name, x: event.clientX - box.left, y: event.clientY - box.top });
  };

  const districtFill = (id: string) => {
    if (id === selectedSiteId) return "var(--map-selected)";
    if (states[id] === "published") return "var(--map-published)";
    if (states[id] === "draft") return "var(--map-draft)";
    return "var(--map-idle)";
  };

  return (
    <div ref={containerRef} className="kz-map relative w-full select-none">
      <svg
        viewBox={viewBox.join(" ")}
        className="block h-auto w-full"
        role="group"
        aria-label={label}
        onPointerLeave={() => setHover(null)}
      >
        <g
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="kz-map-zoom"
        >
          {regions.map((item) => {
            const isSelected = item.slug === selectedRegion;
            const dimmed = selectedRegion !== null && !isSelected;
            const name = item.name[locale];
            return (
              <path
                key={item.slug}
                d={item.path}
                vectorEffect="non-scaling-stroke"
                className={`kz-map-region ${regionActive.has(item.slug) ? "is-active" : ""} ${dimmed ? "is-dimmed" : ""} ${isSelected ? "is-selected" : ""}`}
                role={isSelected ? undefined : "button"}
                tabIndex={isSelected ? -1 : 0}
                aria-label={name}
                onClick={() => onSelectRegion(item.slug)}
                onKeyDown={(event) => activate(event, () => onSelectRegion(item.slug))}
                onPointerMove={(event) => !isSelected && track(event, name)}
              />
            );
          })}

          {visibleDistricts.map((district) => {
            const name = district.name[locale];
            return (
              <path
                key={district.id}
                d={district.path}
                vectorEffect="non-scaling-stroke"
                className="kz-map-district"
                style={{ fill: districtFill(district.id) }}
                role="button"
                tabIndex={0}
                aria-label={name}
                onClick={() => onSelectDistrict(district.id)}
                onKeyDown={(event) => activate(event, () => onSelectDistrict(district.id))}
                onPointerMove={(event) => track(event, name)}
              />
            );
          })}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 max-w-56 -translate-x-1/2 -translate-y-full rounded-lg bg-navy-900/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-lg ring-1 ring-gold-500/30"
          style={{ left: hover.x, top: hover.y - 10 }}
        >
          {hover.name}
        </div>
      )}

      <p className="mt-1 text-right text-[10px] text-ink-dim">{attribution}</p>
    </div>
  );
}
