---
title: Модель контента
type: concept
tags: [content, schema, i18n, supabase]
created: 2026-09-30
updated: 2026-10-01
sources: [lib/content/, supabase/migrations/0001_site_content.sql]
---

# Модель контента

Весь контент сайта - **один JSON-документ** в таблице `public.site_content` (строка `id = 'main'`), переводы kz/ru/en лежат рядом в каждом поле. Фото - в публичном бакете Storage `site-media`, в JSON хранится путь объекта.

## Схема-DSL (`lib/content/schema-dsl.ts`)

Одно описание даёт три вещи: TypeScript-тип (`Infer<typeof schema>`), серверную нормализацию (`coerce`) и форму редактора [[content-editor]].

| Узел | Хранится | Пример |
|---|---|---|
| `loc(label)` | `{ kz, ru, en }` | заголовки, описания, адреса, ФИО со званием |
| `text(label)` | строка, одна на все языки | телефоны, ссылки соцсетей, значения статистики |
| `image(label)` | путь в `site-media` или `https://` URL | логотип, фон шапки, фото инспекторов и устройств |
| `obj(label, fields)` | объект | секция, карточка |
| `list(label, itemLabel, item)` | массив | пункты полиции, льготы, устройства, фото устройства |

Подпись каждого поля (`label`, `hint`) задаётся на трёх языках - это надписи в админке.

`coerce` приводит любые данные к форме схемы: недостающие поля становятся пустыми, лишние отбрасываются, в ссылки пропускаются только `https:`/`http:`/`tel:`/`mailto:` (защита от `javascript:`), пути фото - только безопасные символы без `..`.

## Схема (`lib/content/schema.ts`)

16 секций = 16 вкладок редактора: media, splash, meta, header, emergency, stats, info, points, tracking, recruitment, units, roadSafety, video, social, footer, theme.

- `splash` - одноязычный (экран показывается до выбора языка).
- Телефон хранится один раз; `tel:`-ссылка вычисляется (`toTelHref`) - отдельного поля `phoneRaw` больше нет.
- Пустое `officer.name` в подразделении скрывает блок ответственного; пустой `tiktok` - кнопка «скоро»; пустая ссылка видео скрывает секцию.

## Таблицы и безопасность

- `site_content` - RLS: `select` для `anon`/`authenticated`, записи нет ни у кого, кроме service role.
- `site_content_history` - триггер `before update` копирует прежнюю версию (хранятся последние 200). RLS без политик - читает только service role. Используется для ручного отката.
- `updated_at` сдвигается триггером - по нему редактор ловит одновременные правки (оптимистичная блокировка).
- Бакет `site-media`: публичный на чтение по URL, лимит 5 МБ, только image/*. Загрузка и листинг для `anon` запрещены (проверено).

- `heartbeat` + функция `keep_alive()` - пинги, чтобы бесплатный проект не уходил на паузу ([[keep-alive]]).

## Откат к прежней версии

```sql
-- посмотреть версии
select id, archived_at from site_content_history order by archived_at desc limit 20;
-- вернуть версию N
update site_content set data = (select data from site_content_history where id = N) where id = 'main';
```
После отката - сохранить что-нибудь в /edit или подождать час, чтобы сбросился кэш сайта.

## Связано

- [[architecture]] - поток данных и ISR
- [[i18n-system]] - как контент превращается в словарь языка
- [[content-editor]] - UI редактора
