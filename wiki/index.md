# Индекс wiki - Jylyoi Police

Портал лендингов полиции Казахстана (области и районы, общий дизайн taplink); первый наполненный лендинг - Жылыойский район, Атырауская область. Схема wiki: [[CLAUDE.md]].

## Concepts

- [[architecture]] - Next.js App Router, route groups, слои проекта
- [[design-system]] - токены navy+gold, церемониальный стиль, правила
- [[i18n-system]] - три локали kz/ru/en, фолбэк переводов, надписи админки
- [[content-model]] - контент в Supabase: схема-DSL, таблицы, RLS, фото в Storage, откат версий
- [[keep-alive]] - чтобы бесплатный Supabase не засыпал: Vercel Cron + GitHub Actions + монитор в /edit
- [[multisite]] - много лендингов: адреса, наследование от шаблона, публикация

## Entities

- [[splash-language-select]] - входной экран выбора языка (`/`)
- [[portal-directory]] - портал с картой «Найдите полицию своего района» (`/kz|/ru|/en`)
- [[taplink-page]] - лендинг области/района (`/kz/atyrau/zhylyoi`), общий дизайн
- [[kz-map]] - карта Казахстана из OSM: сборка, SVG-компонент, поиск
- [[content-editor]] - редактор `/edit`: вход по PIN, карта-дашборд, документы, публикация

## Sources

- [[zhylyoi-police-research]] - факты о полиции района (веб-исследование 2026-07-03)

## Analyses

- [[design-review-2026-07]] - итоги дизайн-ревью, исправления, отложенное
