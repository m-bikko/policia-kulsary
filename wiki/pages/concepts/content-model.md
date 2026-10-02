---
title: Модель контента
type: concept
tags: [content, schema, i18n, supabase]
created: 2026-09-30
updated: 2026-10-02
sources: [lib/content/, supabase/migrations/0001_site_content.sql, supabase/migrations/0003_multisite.sql, scripts/migrate-multisite.mts]
---

# Модель контента

Каждая строка `public.site_content` - **отдельный JSON-документ** (миграция 0003), переводы kz/ru/en лежат рядом в каждом поле. Фото - в публичном бакете Storage `site-media`, в JSON хранится путь объекта.

| `kind` | `id` | Что это |
|---|---|---|
| `template` | `template` | общий шаблон: подписи, общенациональные тексты, логотип - для всех лендингов |
| `portal` | `portal` | главная и портал с картой (своя схема `portal-schema.ts`) |
| `region` | slug области: `atyrau` | лендинг департамента области / города респ. значения |
| `district` | `область/район`: `atyrau/zhylyoi` | лендинг районного или городского управления |

`status`: `draft` (не виден на сайте) или `published`. Сейчас 248 строк: шаблон, портал, 246 лендингов (20 регионов + 226 районов, все черновики, кроме Жылыоя). Прежняя строка `main` оставлена для старой версии сайта на проде - **удалить после деплоя**. Подробно о лендингах и наследовании - [[multisite]].

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

Схема лендинга (`schema.ts`): media, meta, header, emergency, stats, info, points, tracking, recruitment, units, roadSafety, video, social, regionDistricts, footer, theme. Секция `splash` переехала в схему портала (`portal-schema.ts`: splash, meta, directory, theme).

- `splash` - одноязычный (экран показывается до выбора языка).
- `regionDistricts` - заголовки блока «Районы области» на лендинге области; `footer.portalLink` - ссылка «Все подразделения полиции Казахстана».
- `SITE_FIELDS` (`split.ts`) - поля, которые у каждого лендинга свои (название, телефоны, адрес, люди, пункты, фото, соцсети). Остальное по умолчанию берётся из шаблона.
- Телефон хранится один раз; `tel:`-ссылка вычисляется (`toTelHref`) - отдельного поля `phoneRaw` больше нет.
- Пустое `officer.name` в подразделении скрывает блок ответственного; пустой `tiktok` - кнопка «скоро»; пустая ссылка видео скрывает секцию.

## Таблицы и безопасность

- `site_content` - RLS: `select` для `anon`/`authenticated` только если `kind in ('template','portal') or status = 'published'` - черновики публичным ключом не читаются (проверено). Записи нет ни у кого, кроме service role.
- `site_content_history` - триггер `before update` копирует прежнюю версию (хранятся последние 200). RLS без политик - читает только service role. Используется для ручного отката.
- `updated_at` сдвигается триггером - по нему редактор ловит одновременные правки (оптимистичная блокировка).
- Бакет `site-media`: публичный на чтение по URL, лимит 5 МБ, только image/*. Загрузка и листинг для `anon` запрещены (проверено).

- `heartbeat` + функция `keep_alive()` - пинги, чтобы бесплатный проект не уходил на паузу ([[keep-alive]]).

## Откат к прежней версии

```sql
-- посмотреть версии документа (смена статуса тоже создаёт версию)
-- вернуть версию N
select id, archived_at from site_content_history where content_id = 'atyrau/zhylyoi' order by archived_at desc limit 20;
-- вернуть версию N документа
update site_content set data = (select data from site_content_history where id = N) where id = 'atyrau/zhylyoi';
```
После отката - сохранить что-нибудь в /edit или подождать час, чтобы сбросился кэш сайта.

## Связано

- [[architecture]] - поток данных и ISR
- [[i18n-system]] - как контент превращается в словарь языка
- [[content-editor]] - UI редактора
