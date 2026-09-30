-- Контент сайта Jylyoi Police: один JSON-документ с переводами kz/ru/en,
-- история версий и публичный бакет для фотографий.
-- Миграция идемпотентна: её можно запускать повторно (pnpm db:migrate).

-- ── Контент ─────────────────────────────────────────────────────
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default clock_timestamp()
);

comment on table public.site_content is
  'Весь контент сайта (строка id = main). Пишется только сервером через service role после входа по PIN.';

-- ── История версий (для отката) ────────────────────────────────
create table if not exists public.site_content_history (
  id bigint generated always as identity primary key,
  content_id text not null,
  data jsonb not null,
  saved_at timestamptz not null,
  archived_at timestamptz not null default clock_timestamp()
);

create index if not exists site_content_history_content_idx
  on public.site_content_history (content_id, archived_at desc);

-- Перед каждым обновлением прежняя версия уходит в историю (хранятся последние 200),
-- а updated_at сдвигается - по нему редактор ловит одновременные правки.
create or replace function public.site_content_archive()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.site_content_history (content_id, data, saved_at)
  values (old.id, old.data, old.updated_at);

  delete from public.site_content_history
  where content_id = old.id
    and id not in (
      select id from public.site_content_history
      where content_id = old.id
      order by archived_at desc
      limit 200
    );

  new.updated_at := clock_timestamp();
  return new;
end;
$$;

drop trigger if exists site_content_archive on public.site_content;
create trigger site_content_archive
  before update on public.site_content
  for each row execute function public.site_content_archive();

-- ── Row Level Security ─────────────────────────────────────────
-- Читать контент может кто угодно (это публичный сайт), писать - никто,
-- кроме service role (он обходит RLS). Историю не видит никто, кроме service role.
alter table public.site_content enable row level security;
alter table public.site_content_history enable row level security;

drop policy if exists "site_content is publicly readable" on public.site_content;
create policy "site_content is publicly readable"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

-- ── Фотографии ─────────────────────────────────────────────────
-- Публичный бакет: файлы отдаются по публичному URL, загрузка - только сервером.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
