---
title: Архитектура сайта
type: concept
tags: [nextjs, app-router, architecture, supabase]
created: 2026-07-03
updated: 2026-10-02
sources: [app/, components/, lib/, supabase/, scripts/]
---

# Архитектура сайта

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, motion, lucide-react. Контент и фото - в Supabase, редактируются в [[content-editor|/edit]]. С 2026-10-02 это **портал множества лендингов** полиции по всему Казахстану - см. [[multisite]].

## Route groups - три root layout

- `app/(splash)/` - корень `/`: экран выбора языка ([[splash-language-select]]). Свой `<html lang="kk">`.
- `app/(site)/[lang]/` - публичный сайт, `<html lang>` из локали:
  - `/kz|/ru|/en` - портал с картой «Найдите полицию своего района» ([[portal-directory]]);
  - `/[lang]/[region]` - лендинг департамента области (`/kz/atyrau`);
  - `/[lang]/[region]/[district]` - лендинг района или города (`/kz/atyrau/zhylyoi`), оба - [[taplink-page]];
  - `not-found.tsx` - 404 на трёх языках (черновик или неверный адрес).
- `app/(admin)/edit/` - редактор ([[content-editor]]): `/edit` - карта-дашборд, `/edit/[...id]` - документ, `/edit/preview/[...id]` - предпросмотр черновика. antd, `robots: noindex`.

Отдельные root layout - способ иметь разный `lang` и разный набор стилей (antd грузится только в админке).

## Слои

- `lib/content/` - [[content-model]]: схемы (лендинг, портал), чтение из Supabase, наследование от шаблона, словарь языка, навигация лендинга (`landing.ts`).
- `lib/geo/` - [[kz-map]]: карта Казахстана (регионы и районы, готовые SVG-пути) и хелперы id лендингов.
- `lib/supabase/` - env-хелперы и серверный admin-клиент (service role).
- `lib/admin/` - сессия по PIN, rate-limit, данные редактора.
- `lib/i18n/` - [[i18n-system]]: локали и тип `Dictionary` (форма данных для компонентов).
- `lib/fonts.ts` - Montserrat (display) + Manrope (body), subset `cyrillic-ext` (казахские глифы).
- `components/splash/`, `components/portal/`, `components/taplink/` - публичный сайт; `components/map/` - SVG-карта и поиск (общие для портала и редактора); `components/admin/` - редактор.
- `app/globals.css` - [[design-system]]: токены цветов, `.card-official`, `.corner-accents` и т.д.
- `supabase/migrations/` - SQL-схема; `supabase/seed-media/` - исходные фото для засева.

## Поток данных

1. `get-content.ts` читает документы `site_content` через PostgREST публичным ключом (RLS отдаёт шаблон, портал и только **опубликованные** лендинги): `getTemplate()`, `getPortal()`, `getSiteContent(id)`, `getPublishedSiteIds()`. Все `fetch` кэшируются с тегом `site-content` и `revalidate: 3600`.
2. `getSiteDictionary(id, locale)` = `inheritFromTemplate(шаблон, лендинг)` → `resolveDictionary` (фолбэк перевода kz → ru → en, пути фото → URL бакета). `loadLanding` добавляет навигацию ([[multisite]]).
3. Страницы - ISR. На сборке пререндерятся только опубликованные лендинги (`generateStaticParams`), остальные рендерятся по запросу (черновик → 404, тоже кэшируется по тегу). Публикация/сохранение в редакторе → `updateTag('site-content')` → портал и лендинги обновляются сразу (проверено: 404 → 200 → 404).
4. Если Supabase недоступен - запасной контент `lib/content/seed/*.json` (шаблон, портал, Жылыой).

## Команды

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm db:migrate` - применить `supabase/migrations/*.sql` (идемпотентно, через `POSTGRES_URL_NON_POOLING`)
- `GET /api/keep-alive` - пинг базы по расписанию, см. [[keep-alive]]
- `pnpm db:seed` - загрузить фото из `supabase/seed-media` в Storage, затем `pnpm db:content`
- `pnpm db:content` - идемпотентно создать шаблон, портал и черновики всех лендингов карты; `--export-seed` - выгрузить запасной контент; `--sync-names=<старый kz-map.json>` - обновить названия в черновиках после пересборки карты
- `pnpm geo:fetch` / `pnpm geo:build` - скачать границы из OSM и собрать `lib/geo/kz-map.json` ([[kz-map]])

## Подводные камни

- `dynamicParams = false` на `/[lang]` ломал ISR после `updateTag`: перегенерируемая страница отдавала 404. Не возвращать - невалидные локали и так отсекает `notFound()`.
- Фото отдаются через `next/image`; хост Supabase разрешён в `images.remotePatterns` (`next.config.ts`, из env + `*.supabase.co`).
- В тестовом headless-браузере (gstack browse) cookie сессии пропадают при перезапуске dev-сервера - это особенность инструмента, серверная сессия переживает рестарт (проверено curl).
- Секции лендинга появляются через `whileInView` - на полностраничном скриншоте нижние секции пустые. Проверять DOM или скриншот после прокрутки.
- Supabase MCP в этой среде подключён к **другому** проекту (таблицы `site_content` там нет). Данные проекта проверять через REST с ключом из `.env` или скриптами `pnpm db:*`.
