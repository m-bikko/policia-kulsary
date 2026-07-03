---
title: Дизайн-система
type: concept
tags: [design, tailwind, tokens, ceremonial]
created: 2026-07-03
updated: 2026-07-03
sources: [app/globals.css, lib/fonts.ts]
---

# Дизайн-система

Направление: **государственно-церемониальное** — палитра взята из эмблемы МВД РК (тёмно-синий + золото), стиль «служебного бланка/удостоверения».

## Токены (app/globals.css, `@theme inline`)

- Фон: `navy-950 #050b1a` … `navy-600`; карточки — градиент navy-800→900.
- Акцент: `gold-500 #d4af37` (кнопка 102, оверлайны, иконки), `gold-300/400` для текста на тёмном.
- Текст: `ink #eef2fb`, `ink-soft #a8b8d8`, `ink-dim #6d7fa3` (только мета, контраст ≈4.6:1).
- Шрифты: `--font-display` Unbounded, `--font-body` Manrope — оба с `cyrillic-ext` (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, І).

## Фирменные приёмы

- `.bg-ceremonial` — радиальное золотое свечение сверху + тонкая сетка 48px.
- `.grain` — SVG-шум поверх, убирает бандинг градиентов.
- `.card-official` — карточка с золотой hairline-рамкой, hover усиливает рамку и тень.
- `.corner-accents` — золотые уголки как на бланках (акцентные карточки).
- `.gold-divider` — линия с заголовком вразрядку (tracking 0.22em).

## Правила

- Иконки — только lucide-react + инлайн SVG брендов (Instagram/TikTok/Facebook). Эмодзи запрещены.
- Тач-таргеты ≥44px (проверено дизайн-ревью, см. [[design-review-2026-07]]).
- Анимации — только transform/opacity, 150–500ms, везде `useReducedMotion`.
- Секции нумеруются золотыми оверлайнами 01–08.
