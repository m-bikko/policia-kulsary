---
title: Архитектура сайта
type: concept
tags: [nextjs, app-router, architecture]
created: 2026-07-03
updated: 2026-07-03
sources: [app/, components/, lib/]
---

# Архитектура сайта

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, motion (framer-motion), lucide-react. Все маршруты пререндерятся статически.

## Route groups - два root layout

- `app/(splash)/` - корень `/`: экран выбора языка ([[splash-language-select]]). Свой `<html lang="kk">`.
- `app/(site)/[lang]/` - `/kz`, `/ru`, `/en`: taplink-страница ([[taplink-page]]). `<html lang>` выставляется из локали через `generateStaticParams`.

Два root layout в route groups - это способ иметь разный `lang` атрибут для splash и локализованных страниц.

## Слои

- `lib/i18n/` - [[i18n-system]]: конфиг локалей, типизированный `Dictionary`, словари kz/ru/en.
- `lib/fonts.ts` - Unbounded (display) + Manrope (body), оба с subset `cyrillic-ext` (казахские глифы).
- `components/splash/` - клиентский экран выбора языка.
- `components/taplink/` - `TaplinkPage` (сборка), `sections.tsx` (8 секций), `primitives.tsx` (Reveal/SectionTitle/Collapsible).
- `app/globals.css` - [[design-system]]: токены цветов в `@theme inline`, классы `.bg-ceremonial`, `.card-official`, `.corner-accents`, `.grain`, `.gold-divider`.

## Данные

Контент зашит в словари (статический сайт без бэкенда). Факты - из [[zhylyoi-police-research]].

## Команды

`pnpm dev` / `pnpm build` / `pnpm start`. Ассеты лого: `public/images/logo-mvd*.png` (ресайз из `Logo_MVD_KZ_new.png`).
