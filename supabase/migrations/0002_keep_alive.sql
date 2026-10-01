-- Keep-alive: бесплатный проект Supabase ставится на паузу, если за 7 дней
-- в базе не было пользовательской активности. Планировщики (Vercel Cron,
-- GitHub Actions) несколько раз в день вызывают keep_alive() - это настоящая
-- запись в БД, - а таблица heartbeat хранит время последнего пинга от каждого
-- источника (редактор /edit показывает предупреждение, если пинги пропали).
-- Миграция идемпотентна.

create table if not exists public.heartbeat (
  source text primary key
    check (source in ('vercel-cron', 'github-actions', 'manual')),
  last_ping_at timestamptz not null default clock_timestamp(),
  ping_count bigint not null default 0
);

comment on table public.heartbeat is
  'Последний keep-alive пинг от каждого планировщика. Пишется только функцией keep_alive().';

-- RLS без политик: напрямую таблицу не читает и не пишет никто, кроме service role
alter table public.heartbeat enable row level security;

-- SECURITY DEFINER + фиксированный search_path: функция может писать в heartbeat,
-- хотя у вызывающего (anon) прав на таблицу нет. Неизвестный source -> 'manual'.
create or replace function public.keep_alive(p_source text default 'manual')
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_source text := case
    when p_source in ('vercel-cron', 'github-actions', 'manual') then p_source
    else 'manual'
  end;
  v_at timestamptz := clock_timestamp();
begin
  insert into public.heartbeat as h (source, last_ping_at, ping_count)
  values (v_source, v_at, 1)
  on conflict (source) do update
    set last_ping_at = excluded.last_ping_at,
        ping_count = h.ping_count + 1;
  return v_at;
end;
$$;

comment on function public.keep_alive(text) is
  'Keep-alive пинг (запись в heartbeat). Вызывается по расписанию публичным ключом через /rest/v1/rpc/keep_alive.';

-- Вызывать может публичный ключ: функция пишет одну строку на источник, вреда от повторов нет
revoke all on function public.keep_alive(text) from public;
grant execute on function public.keep_alive(text) to anon, authenticated, service_role;
