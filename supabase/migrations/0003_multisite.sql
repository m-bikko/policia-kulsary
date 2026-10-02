-- Много лендингов: каждая строка site_content - отдельный документ.
--   kind = 'template' - общий шаблон (подписи, общенациональные тексты), id = 'template'
--   kind = 'portal'   - главная страница с картой, id = 'portal'
--   kind = 'region'   - лендинг департамента области, id = slug области ('atyrau')
--   kind = 'district' - лендинг районного управления, id = 'область/район' ('atyrau/zhylyoi')
-- status: черновики не видны публичному ключу. Данные переносит scripts/migrate-multisite.ts.
-- Миграция идемпотентна.

alter table public.site_content add column if not exists kind text;
alter table public.site_content add column if not exists status text not null default 'draft';

-- Прежняя единственная строка 'main' (контент Жылыоя) остаётся опубликованной, пока её
-- читает старая версия сайта; новая версия её не использует, удалить можно после деплоя.
update public.site_content set kind = 'district', status = 'published' where kind is null;
alter table public.site_content alter column kind set not null;

do $$
begin
  alter table public.site_content
    add constraint site_content_kind_check check (kind in ('template', 'portal', 'region', 'district'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.site_content
    add constraint site_content_status_check check (status in ('draft', 'published'));
exception when duplicate_object then null;
end $$;

create index if not exists site_content_kind_status_idx on public.site_content (kind, status);

comment on table public.site_content is
  'Контент сайтов: общий шаблон, портал и лендинги областей/районов. Пишется только сервером (service role) после входа по PIN.';

-- Публичный ключ читает шаблон, портал и опубликованные лендинги; черновики не видны
drop policy if exists "site_content is publicly readable" on public.site_content;
drop policy if exists "site_content published is publicly readable" on public.site_content;
create policy "site_content published is publicly readable"
  on public.site_content
  for select
  to anon, authenticated
  using (kind in ('template', 'portal') or status = 'published');
