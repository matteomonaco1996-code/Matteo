-- =====================================================================
-- Zona Giusta — database su Supabase (regione UE, Francoforte)
-- Come usarlo: SQL Editor → incolla tutto → Run. Poi esegui supabase/luoghi.sql.
-- Si può rieseguire senza danni.
--
-- Principi:
--  * dati minimi: email (gestita da Supabase Auth) e UNA richiesta per persona
--    (dove deve arrivare, minuti, quartieri, budget, tipo di alloggio, da quando).
--    Niente nome, telefono, reddito, testo libero.
--  * il browser non scrive mai nella tabella: passa da salva_richiesta(), che controlla tutto.
--  * Row Level Security: ognuno legge solo la propria richiesta. In pubblico escono solo
--    i conteggi per quartiere; il budget tipico solo da 5 richieste in su.
-- =====================================================================

-- ---------- Tabelle ----------

-- Destinazioni e quartieri ammessi (generati da strumenti/luoghi_sql.py)
create table if not exists public.mete (
  id         text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
  nome       text not null,
  quartiere  boolean not null default false     -- true: si può anche scegliere come zona dove vivere
);

create table if not exists public.richieste (
  utente            uuid primary key references auth.users (id) on delete cascade,   -- una richiesta per persona
  meta              text not null references public.mete (id),                       -- dove deve arrivare ogni mattina
  minuti_max        smallint not null check (minuti_max in (20, 30, 45, 60)),
  zone              text[] not null check (cardinality(zone) between 1 and 40),      -- quartieri che accetta
  budget            smallint not null check (budget between 200 and 3000),           -- euro al mese, spese comprese
  tipo              text not null check (tipo in ('stanza_singola', 'stanza_doppia', 'monolocale', 'appartamento')),
  da_quando         date not null,
  chi               text not null check (chi in ('studio', 'lavoro', 'studio_lavoro')),
  maggiorenne       boolean not null check (maggiorenne),
  termini_versione  text not null check (char_length(termini_versione) <= 10),
  privacy_versione  text not null check (char_length(privacy_versione) <= 10),
  creata            timestamptz not null default now(),
  aggiornata        timestamptz not null default now()
);
create index if not exists richieste_zone on public.richieste using gin (zone);

-- ---------- Accessi: si parte da zero e si apre solo il necessario ----------

alter table public.mete      enable row level security;
alter table public.richieste enable row level security;

revoke all on public.mete, public.richieste from anon, authenticated;
grant select on public.richieste to authenticated;

drop policy if exists "richiesta: lettura propria" on public.richieste;
create policy "richiesta: lettura propria" on public.richieste for select to authenticated using (utente = (select auth.uid()));

-- ---------- Funzioni ----------

-- Crea o aggiorna la richiesta di chi è entrato. Salvare di nuovo la conferma come ancora valida.
create or replace function public.salva_richiesta(
  p_meta text, p_minuti int, p_zone text[], p_budget int, p_tipo text, p_da_quando date,
  p_chi text, p_maggiorenne boolean, p_termini text, p_privacy text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare
  u uuid := auth.uid();
  z text[];
begin
  if u is null then raise exception 'Accesso richiesto'; end if;
  if p_maggiorenne is not true then raise exception 'Serve avere almeno 18 anni'; end if;
  if p_da_quando is null or p_da_quando < current_date - 31 or p_da_quando > current_date + 366 then
    raise exception 'Data di inizio non valida';
  end if;
  -- Quartieri: senza doppioni, e solo quelli che esistono
  select array_agg(distinct x order by x) into z from unnest(p_zone) x;
  if z is null or exists (select 1 from unnest(z) x where not exists (select 1 from public.mete m where m.id = x and m.quartiere)) then
    raise exception 'Quartieri non validi';
  end if;
  insert into public.richieste (utente, meta, minuti_max, zone, budget, tipo, da_quando, chi, maggiorenne, termini_versione, privacy_versione)
    values (u, p_meta, p_minuti, z, p_budget, p_tipo, p_da_quando, p_chi, true, p_termini, p_privacy)
  on conflict (utente) do update set
    meta = excluded.meta, minuti_max = excluded.minuti_max, zone = excluded.zone, budget = excluded.budget,
    tipo = excluded.tipo, da_quando = excluded.da_quando, chi = excluded.chi,
    termini_versione = excluded.termini_versione, privacy_versione = excluded.privacy_versione, aggiornata = now();
  return json_build_object('ok', true);
end $$;

-- Numeri pubblici: quante richieste attive (confermate negli ultimi 90 giorni) includono ogni quartiere.
-- Il budget tipico (mediana, arrotondata a 10 euro) esce solo da 5 richieste in su, per non
-- rendere riconoscibile nessuno.
create or replace function public.richieste_per_zona()
returns json language sql stable security definer set search_path = public as $$
  with attive as (select * from public.richieste where aggiornata > now() - interval '90 days'),
  per_zona as (
    select z as zona, count(*)::int as richieste,
           case when count(*) >= 5 then (round(percentile_cont(0.5) within group (order by budget) / 10) * 10)::int end as budget_tipico
    from attive, unnest(zone) z group by z)
  select json_build_object(
    'totale', (select count(*)::int from attive),
    'zone', coalesce((select json_agg(json_build_object('zona', zona, 'richieste', richieste, 'budget_tipico', budget_tipico)) from per_zona), '[]'::json));
$$;

-- ---------- Diritti GDPR self-service ----------

-- Accesso e portabilità (art. 15 e 20): tutti i dati dell'utente in JSON.
create or replace function public.esporta_dati()
returns json language plpgsql stable security definer set search_path = public as $$
declare u uuid := auth.uid();
begin
  if u is null then raise exception 'Accesso richiesto'; end if;
  return json_build_object(
    'esportato', now(),
    'account', (select json_build_object('id', id, 'email', email, 'creato', created_at, 'ultimo_accesso', last_sign_in_at)
                from auth.users where id = u),
    'richiesta', (select row_to_json(r) from public.richieste r where r.utente = u));
end $$;

-- Cancellazione (art. 17): elimina l'account e, a cascata, la richiesta.
create or replace function public.elimina_account()
returns void language plpgsql volatile security definer set search_path = public, auth as $$
declare u uuid := auth.uid();
begin
  if u is null then raise exception 'Accesso richiesto'; end if;
  delete from auth.users where id = u;
end $$;

-- Le funzioni non sono eseguibili da chiunque per default: si apre solo il necessario.
revoke execute on function
  public.salva_richiesta(text, int, text[], int, text, date, text, boolean, text, text),
  public.richieste_per_zona(), public.esporta_dati(), public.elimina_account() from public, anon, authenticated;
grant execute on function
  public.salva_richiesta(text, int, text[], int, text, date, text, boolean, text, text),
  public.esporta_dati(), public.elimina_account() to authenticated;
grant execute on function public.richieste_per_zona() to anon, authenticated;

-- ---------- Conservazione (serve l'estensione pg_cron: Database → Extensions) ----------
-- Ogni lunedì: via le richieste non confermate da 12 mesi (con il loro account) e gli account
-- creati da più di 30 giorni che non hanno mai lasciato una richiesta.
-- select cron.schedule('pulizia-zona-giusta', '23 4 * * 1', $$
--   delete from auth.users u where
--     exists (select 1 from public.richieste r where r.utente = u.id and r.aggiornata < now() - interval '12 months')
--     or (not exists (select 1 from public.richieste r where r.utente = u.id) and u.created_at < now() - interval '30 days');
-- $$);
