---
title: Дизайн-ревью 2026-07
type: analysis
tags: [design-review, accessibility, audit]
created: 2026-07-03
updated: 2026-07-03
sources: ["~/.gstack/projects/policia-kulsary/designs/design-audit-20260703/"]
---

# Дизайн-ревью 2026-07

Проведено скиллом /design-review по живому сайту (localhost). Итог: **Design Score A−, AI Slop Score A**.

## Исправлено (по коммитам style(design))

- FINDING-001: пилюли переключателя языка 29px → `min-h-11` (44px).
- FINDING-002: кнопки 2ГИС/Google 40px → 44px.
- FINDING-003: ссылка «Сменить язык» в футере 16px → 44px hit area.
- FINDING-004: подписи 10px → 12px; favicon добавлен на splash.

После фиксов на странице нет ни одного интерактивного элемента меньше 44×44px.

## Отложено (контент, не код)

См. раздел «Неподтверждённое» в [[zhylyoi-police-research]]: телефон дежурной части, опорные пункты в сёлах, TikTok, собственное видео.

## Выводы для будущих правок

- Стиль держится на токенах [[design-system]] — новые элементы делать через `.card-official` / gold-оверлайны, не изобретать новые цвета.
- Мобильная колонка (max-w-lg) — сознательное решение формата taplink, на десктопе не растягивать.
