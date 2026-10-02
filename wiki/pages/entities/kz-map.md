---
title: Карта Казахстана
type: entity
tags: [map, geo, osm, svg]
created: 2026-10-02
updated: 2026-10-02
sources: [scripts/geo/fetch-osm.mjs, scripts/geo/build-map.mjs, lib/geo/kz.ts, lib/geo/kz-map.json, components/map/]
---

# Карта Казахстана

Административная карта для [[portal-directory|портала]] и [[content-editor|дашборда редактора]]: 20 регионов и 226 районов/городов. Рисуется обычным SVG **без картографических библиотек** - пути заранее спроецированы скриптом.

## Данные (`lib/geo/kz-map.json`, ~228 КБ)

`viewBox [0,0,1000,568]`, `regions[]` и `districts[]` с полями `slug`, `name {kz,ru,en}`, `path`, `bbox`, `center`, у района - `region` и `osmId`. Атрибуция «© OpenStreetMap contributors, ODbL» выводится под картой (требование лицензии).

## Сборка

1. `pnpm geo:fetch` (`fetch-osm.mjs`) - теги отношений admin_level 4/6 через Overpass (нужен User-Agent), геометрия через polygons.openstreetmap.fr (Overpass на больших областях отдаёт 504). Кэш `scripts/geo/.cache/` (в .gitignore).
2. `pnpm geo:build` (`build-map.mjs`) - mapshaper: snap, упрощение 4%, `clean overlap-rule=min-area` (иначе города-анклавы пропадают), dissolve районов в регионы; d3-geo `geoConicEqualArea` (параллели 44/52) → SVG-пути.
   - Кольца перекручиваются под сферический d3 (иначе каждый полигон = «весь мир»).
   - Район привязывается к самому маленькому региону, содержащему ≥60% его точек (полигоны областей не имеют дыр под Астану/Алматы/Шымкент).
   - Slug - транслит казахского названия без служебных слов; город с тем же именем, что район или область, получает `-city` (`kostanay/kostanai-city`).
   - Названия нормализуются: районы «Жылыой ауданы / Жылыойский район / Zhylyoi District», города «Атырау қаласы / город Атырау / Atyrau City» (OSM даёт «Семей Г.А.», «Ақтөбе Қ.Ә.», английский в новой казахской латинице). Английский - латиница казахского названия; 4 области с принятым написанием (Abai, Aktobe, Zhambyl, Zhetisu) заданы явно.
3. После пересборки: `pnpm db:content --sync-names=<копия старого kz-map.json>` - обновит названия в черновиках, не трогая отредактированные.

## Код

- `lib/geo/kz.ts` - типы и хелперы: `getRegion`, `districtsOf`, `getGeoSite(id)`, `allGeoSites()`, `sitePath(locale, id)`.
- `components/map/KzMapView.tsx` - SVG: зум в область CSS-трансформом группы (`non-scaling-stroke`), районы окрашены по статусу (`--map-published/draft/idle/selected`), клавиатура Enter/Space, тултип. Анимация зума отключается при `prefers-reduced-motion`.
- `components/map/use-region-hash.ts` - выбранная область в якоре адреса (`#atyrau`): работает «назад», лендинги и редактор возвращают на приближенную область.
- `components/map/search.ts` - поиск по трём языкам без учёта регистра и казахских букв («кулсары» ≈ «құлсары»).
- Данные карты импортируются в клиентский бандл (кэшируемый JS-чанк), сервер передаёт только статусы.

## Ограничения

- Района Туран (Шымкент) нет в OSM.
- Названия и границы - на дату сборки OSM (`generatedAt` в JSON).
