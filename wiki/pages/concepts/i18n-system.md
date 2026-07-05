---
title: Система i18n
type: concept
tags: [i18n, kazakh, russian, english]
created: 2026-07-03
updated: 2026-07-03
sources: [lib/i18n/]
---

# Система i18n

Три локали: `kz` (казахский, html lang="kk"), `ru`, `en`. Роутинг - сегмент `[lang]` с `generateStaticParams`; невалидная локаль → `notFound()`.

## Устройство

- `lib/i18n/config.ts` - список локалей, `htmlLang` маппинг (kz→kk), лейблы кнопок (QAZ/RUS/ENG).
- `lib/i18n/types.ts` - строго типизированный `Dictionary` (никаких `any`): все три словаря обязаны иметь одинаковую структуру, компилятор ловит пропуски.
- `lib/i18n/dictionaries/{kz,ru,en}.ts` - полные словари, включая URL (Википедия и gov.kz локализованы по языку).

## Выбор языка

[[splash-language-select]] сохраняет выбор в `localStorage("jylyoi-lang")` и делает `router.push("/{locale}")`. Автередиректа нет - на `/` всегда показывается выбор (запомненный язык подсвечивается точкой). Переключатель на странице - ссылки на соседние локали.

## Правило

Любой новый UI-текст добавляется сразу в все три словаря - тип `Dictionary` это форсирует.
