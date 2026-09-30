---
title: Система i18n
type: concept
tags: [i18n, kazakh, russian, english]
created: 2026-07-03
updated: 2026-09-30
sources: [lib/i18n/, lib/content/resolve.ts, components/admin/admin-strings.ts]
---

# Система i18n

Три локали: `kz` (казахский, html lang="kk"), `ru`, `en`. Роутинг - сегмент `[lang]` с `generateStaticParams`; невалидная локаль → `notFound()`.

## Где живут переводы (с 2026-09-30)

Словари `lib/i18n/dictionaries/*.ts` **удалены** - весь текст сайта теперь в Supabase ([[content-model]]) и редактируется в [[content-editor]]:

- Каждое переводимое поле хранится как `{ kz, ru, en }` рядом - один документ вместо трёх словарей, списки не могут «разъехаться» между языками.
- `lib/i18n/types.ts` - тип `Dictionary`: форма данных одного языка, которую ждут компоненты сайта. Компоненты не менялись.
- `lib/content/resolve.ts` - `resolveDictionary(content, locale, mediaBase)` собирает `Dictionary` из контента. **Фолбэк**: пустой перевод подменяется другим языком (сначала выбранный, затем kz → ru → en), поэтому текст, введённый пока на одном языке, не оставляет дыр.
- `lib/content/get-dictionary.ts` - `getDictionary(locale)` для страниц (async).
- `lib/i18n/config.ts` - список локалей, `htmlLang`, лейблы QAZ/RUS/ENG.

## Интерфейс редактора

Надписи самой админки - в `components/admin/admin-strings.ts` (объект на три языка), подписи полей - прямо в схеме контента (`t(kz, ru, en)`). Встроенные тексты antd (Popconfirm и т.п.) - через локали `kk_KZ`/`ru_RU`/`en_US`.

## Выбор языка на сайте

[[splash-language-select]] сохраняет выбор в `localStorage("jylyoi-lang")` и делает `router.push("/{locale}")`. Автоперехода нет - на `/` всегда показывается выбор (запомненный язык подсвечивается точкой).

## Правило

Новое поле контента добавляется в схему (`lib/content/schema.ts`) с подписью на трёх языках и в `resolveDictionary`/`Dictionary`, если его показывает сайт. Новая надпись админки - сразу во все три ветки `adminStrings`.
