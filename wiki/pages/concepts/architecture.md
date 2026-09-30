---
title: Архитектура сайта
type: concept
tags: [nextjs, app-router, architecture, supabase]
created: 2026-07-03
updated: 2026-09-30
sources: [app/, components/, lib/, supabase/]
---

# Архитектура сайта

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, motion, lucide-react. Контент и фото - в Supabase, редактируются в [[content-editor|/edit]].

## Route groups - три root layout

- `app/(splash)/` - корень `/`: экран выбора языка ([[splash-language-select]]). Свой `<html lang="kk">`.
- `app/(site)/[lang]/` - `/kz`, `/ru`, `/en`: taplink-страница ([[taplink-page]]). `<html lang>` из локали.
- `app/(admin)/edit/` - редактор контента ([[content-editor]]): вход по PIN, antd, свой layout с `robots: noindex`.

Отдельные root layout - способ иметь разный `lang` и разный набор стилей (antd грузится только в админке).

## Слои

- `lib/content/` - [[content-model]]: схема контента (DSL), чтение из Supabase, превращение в словарь языка.
- `lib/supabase/` - env-хелперы и серверный admin-клиент (service role).
- `lib/admin/` - сессия по PIN, rate-limit, данные редактора.
- `lib/i18n/` - [[i18n-system]]: локали и тип `Dictionary` (форма данных для компонентов).
- `lib/fonts.ts` - Montserrat (display) + Manrope (body), subset `cyrillic-ext` (казахские глифы).
- `components/splash/`, `components/taplink/` - публичный сайт; `components/admin/` - редактор.
- `app/globals.css` - [[design-system]]: токены цветов, `.card-official`, `.corner-accents` и т.д.
- `supabase/migrations/` - SQL-схема; `supabase/seed-media/` - исходные фото для засева.

## Поток данных

1. `getContent()` читает строку `site_content.main` через PostgREST публичным ключом (RLS: только select). `fetch` кэшируется с тегом `site-content` и `revalidate: 3600`.
2. `resolveDictionary(content, locale, mediaBase)` собирает `Dictionary` для одного языка: пустой перевод подменяется другим языком (kz → ru → en), пути фото превращаются в публичные URL бакета `site-media`.
3. Страницы `/[lang]` и `/` - ISR: статичны, перегенерируются после сохранения в редакторе (`updateTag('site-content')`) или раз в час.
4. Если Supabase недоступен - отдаётся эталонный контент `lib/content/default-content.json` (сайт не падает).

## Команды

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm db:migrate` - применить `supabase/migrations/*.sql` (идемпотентно, через `POSTGRES_URL_NON_POOLING`)
- `pnpm db:seed` - загрузить фото из `supabase/seed-media` в Storage и записать эталонный контент, если базы ещё нет (`--force-content` - перезаписать)

## Подводные камни

- `dynamicParams = false` на `/[lang]` ломал ISR после `updateTag`: перегенерируемая страница отдавала 404. Не возвращать - невалидные локали и так отсекает `notFound()`.
- Фото отдаются через `next/image`; хост Supabase разрешён в `images.remotePatterns` (`next.config.ts`, из env + `*.supabase.co`).
- В тестовом headless-браузере (gstack browse) cookie сессии пропадают при перезапуске dev-сервера - это особенность инструмента, серверная сессия переживает рестарт (проверено curl).
