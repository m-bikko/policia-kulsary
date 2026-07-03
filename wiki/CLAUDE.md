# Wiki проекта Jylyoi Police

LLM-поддерживаемая база знаний (Obsidian-friendly). Контент — на русском, имена файлов — kebab-case на английском.

## Структура

```
wiki/
├── CLAUDE.md           # эта схема
├── index.md            # каталог всех страниц
├── log.md              # хронология операций
├── raw/                # неизменяемые источники (+ assets/)
└── pages/
    ├── entities/       # компоненты, страницы, системы
    ├── concepts/       # архитектура, дизайн-система, i18n
    ├── sources/        # саммари исследований и источников
    └── analyses/       # решения и сравнения
```

## Frontmatter (обязателен)

```yaml
---
title: Название
type: entity | concept | source | analysis
tags: [тег1, тег2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [пути или URL]
---
```

## Правила

- Связи — через `[[wikilinks]]`; каждая страница должна иметь входящую ссылку минимум из `index.md`.
- Технические термины не переводить (App Router, route group, static export).
- Не хранить: git-историю, номера строк, секреты, ephemeral-задачи.
- При изменении архитектуры/контента — обновить страницы, поднять `updated:`, записать в `log.md`.
