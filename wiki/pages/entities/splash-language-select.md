---
title: Splash - выбор языка
type: entity
tags: [component, splash, i18n]
created: 2026-07-03
updated: 2026-07-03
sources: [components/splash/LanguageSelect.tsx, app/(splash)/]
---

# Splash - выбор языка

Входной экран `/` (левое окно макета): эмблема МВД с золотым свечением, «Жылыой полициясы», подпись министерства и три кнопки **QAZ / RUS / ENG** (порядок как в макете).

- Клик: `localStorage("jylyoi-lang")` + `router.push(/{locale})`; маршруты префетчатся заранее.
- Автередиректа нет - предыдущий выбор помечается золотой точкой.
- Staggered-появление элементов (motion), при reduced-motion - только fade.
- Живёт в route group `(splash)` со своим root layout - см. [[architecture]].
