---
title: Keep-alive базы Supabase
type: concept
tags: [supabase, cron, reliability, vercel, github-actions]
created: 2026-10-01
updated: 2026-10-01
sources:
  - supabase/migrations/0002_keep_alive.sql
  - app/api/keep-alive/route.ts
  - lib/supabase/keep-alive.ts
  - vercel.json
  - .github/workflows/supabase-keep-alive.yml
  - https://supabase.com/docs/guides/platform/free-project-pausing
  - https://vercel.com/docs/cron-jobs/manage-cron-jobs
---

# Keep-alive базы Supabase

Бесплатный проект Supabase ставится на паузу, если за 7 дней в базе не было «пользовательской активности». По документации Supabase достаточно **нескольких запросов к БД каждый день**. Посещения сайта не спасают: страницы кэшируются ([[architecture]] - ISR), поэтому при малом трафике в базу никто не ходит.

## Что считается пингом

Функция `public.keep_alive(p_source)` - `SECURITY DEFINER`, пишет строку в `public.heartbeat` (одна строка на источник: `last_ping_at`, `ping_count`). Каждый пинг = **запись** (rpc) + **чтение** (`site_content`) - два настоящих запроса к БД. Функция разрешена публичному ключу; таблица под RLS без политик (напрямую её не читает и не пишет никто, кроме service role). Неизвестный `p_source` превращается в `manual`.

## Три слоя защиты

| Слой | Как | Когда | Особенности |
|---|---|---|---|
| Vercel Cron (основной) | `vercel.json` → `GET /api/keep-alive` | 03:00 и 15:00 UTC (08:00 и 20:00 Алматы) | Hobby: каждый cron ≤1 раза в сутки и в пределах часа, доставка «best effort» - поэтому два cron. Защита: `CRON_SECRET` (Vercel сам шлёт `Authorization: Bearer`); без секрета эндпоинт открыт, но безвреден |
| GitHub Actions (резерв) | `.github/workflows/supabase-keep-alive.yml` → curl прямо в Supabase REST | 02:41 и 14:41 UTC + ручной запуск | Работает даже без деплоя. Нужны секреты `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Публичный репо: GitHub отключает расписание после 60 дней без коммитов (присылает письмо) - включить в Actions → Enable workflow |
| Монитор в [[content-editor]] | `/edit` читает `heartbeat` | при каждом открытии | Если последний пинг старше 48 ч или пингов не было - жёлтое предупреждение (на 3 языках) |

Итого до 4 пингов в сутки × 2 запроса - с запасом под «несколько запросов каждый день».

## Решения и почему

- **Не обходим 60-дневное правило GitHub.** Популярный `keepalive-workflow` (автоматически переактивировал расписания) заблокирован GitHub за нарушение ToS - поэтому резерв честный, а основной слой - Vercel Cron, у которого такого правила нет.
- **Не pg_cron внутри базы**: неясно, засчитывает ли Supabase внутреннюю активность, а на паузе он всё равно не работает.
- **Без `CRON_SECRET` не отказываем**: забытая переменная не должна тихо сломать cron; операция идемпотентна и обновляет одну строку.

## Если база всё-таки уснула

- Сайт не падает - показывает встроенный эталонный контент (`lib/content/default-content.json`), но правки из /edit не сохраняются.
- Восстановить: Supabase Dashboard → проект → Resume (данные хранятся до 1 года).

## Проверка вручную

- `curl https://<сайт>/api/keep-alive` (с `-H "Authorization: Bearer $CRON_SECRET"`, если задан) → `{"ok":true,...}`
- GitHub → Actions → «Supabase keep-alive» → Run workflow
- Vercel → Settings → Cron Jobs → View Logs

## Связано

- [[content-model]] - таблицы и RLS
- [[architecture]] - поток данных и кэш
