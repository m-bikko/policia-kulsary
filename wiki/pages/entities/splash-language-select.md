---
title: Splash - выбор языка
type: entity
tags: [component, splash, i18n]
created: 2026-07-03
updated: 2026-10-02
sources: [components/splash/LanguageSelect.tsx, app/(splash)/]
---

# Splash - выбор языка

Входной экран `/` (левое окно макета): эмблема с золотым свечением, заголовок и подзаголовок, надпись «Тілді таңдаңыз» и три кнопки **QAZ / RUS / ENG** (порядок как в макете). Тексты приходят из документа `portal` (секция `splash`), логотип - из общего шаблона (`media.logo`), см. [[content-model]] - редактируются в [[content-editor]]; секция одноязычная, т.к. язык ещё не выбран.

- Клик: `localStorage("jylyoi-lang")` + `router.push(/{locale})` - на портал с картой ([[portal-directory]]); маршруты префетчатся заранее.
- Заголовок по умолчанию общенациональный: «Қазақстан Республикасының полициясы» / МВД РК.
- Автоперехода нет - предыдущий выбор помечается золотой точкой.
- Staggered-появление элементов (motion), при reduced-motion - только fade.
- Живёт в route group `(splash)` со своим root layout - см. [[architecture]].
