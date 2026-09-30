---
title: Splash - выбор языка
type: entity
tags: [component, splash, i18n]
created: 2026-07-03
updated: 2026-09-30
sources: [components/splash/LanguageSelect.tsx, app/(splash)/]
---

# Splash - выбор языка

Входной экран `/` (левое окно макета): эмблема с золотым свечением, заголовок и подзаголовок, надпись «Тілді таңдаңыз» и три кнопки **QAZ / RUS / ENG** (порядок как в макете). Тексты и логотип приходят из контента (секция `splash` + `media.logo`, [[content-model]]) - редактируются в [[content-editor]]; секция одноязычная, т.к. язык ещё не выбран.

- Клик: `localStorage("jylyoi-lang")` + `router.push(/{locale})`; маршруты префетчатся заранее.
- Автоперехода нет - предыдущий выбор помечается золотой точкой.
- Staggered-появление элементов (motion), при reduced-motion - только fade.
- Живёт в route group `(splash)` со своим root layout - см. [[architecture]].
