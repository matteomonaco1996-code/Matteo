// Test di sicurezza del database (Row Level Security, regole delle richieste, diritti GDPR).
// Usa PGlite (Postgres in WebAssembly) con un finto schema "auth" di Supabase.
// Come lanciarlo, dalla cartella del sito:
//   npm install --no-save @electric-sql/pglite@0.5.16
//   node strumenti/test_database.mjs supabase/schema.sql supabase/luoghi.sql

import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
const db = new PGlite();
const ok = (m) => console.log("  ✓", m), ko = (m) => { console.log("  ✗", m); process.exitCode = 1; };
const verifica = (cond, m) => (cond ? ok(m) : ko(m));
async function fallisce(sql, msg) { try { await db.exec(sql); ko(msg + " (doveva fallire)"); } catch (e) { ok(msg + " → " + e.message.split("\n")[0].slice(0, 70)); } }
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text, created_at timestamptz default now(), last_sign_in_at timestamptz);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  grant usage on schema public, auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
`);
const schema = fs.readFileSync(process.argv[2], "utf8"), luoghi = fs.readFileSync(process.argv[3], "utf8");
await db.exec(schema); ok("schema.sql eseguito");
await db.exec(luoghi); ok("luoghi.sql eseguito: " + (await db.query("select count(*)::int n from public.mete")).rows[0].n + " mete");
await db.exec(schema); await db.exec(luoghi); ok("schema.sql e luoghi.sql rieseguibili");

const id = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
for (let i = 1; i <= 7; i++) await db.exec(`insert into auth.users (id, email) values ('${id(i)}', 'u${i}@example.org')`);
const come = async (uid, ruolo = "authenticated") => db.exec(`reset role; select set_config('test.uid', '${uid}', false); set role ${ruolo};`);
const q = async (sql) => (await db.query(sql)).rows;
const salva = (o = {}) => {
  const v = { meta: "sapienza", minuti: 30, zone: "array['q-san-lorenzo','q-pigneto']", budget: 600, tipo: "stanza_singola", da: "current_date + 20", chi: "studio", magg: true, ...o };
  return `select public.salva_richiesta('${v.meta}', ${v.minuti}, ${v.zone}, ${v.budget}, '${v.tipo}', ${v.da}, '${v.chi}', ${v.magg}, '1.0', '1.0')`;
};

console.log("Senza accesso");
await come("", "anon");
await fallisce(`select * from public.richieste`, "anonimo non legge le richieste");
await fallisce(`select * from public.mete`, "anonimo non legge la tabella delle mete");
await fallisce(salva(), "anonimo non può salvare una richiesta");
await fallisce(`select public.esporta_dati()`, "anonimo non esporta dati");
let r = await q(`select public.richieste_per_zona() j`);
verifica(r[0].j.totale === 0 && r[0].j.zone.length === 0, "numeri pubblici a zero quando non c'è nessuno");

console.log("Utente 1");
await come(id(1));
await fallisce(`insert into public.richieste (utente, meta, minuti_max, zone, budget, tipo, da_quando, chi, maggiorenne, termini_versione, privacy_versione)
  values ('${id(1)}', 'sapienza', 30, array['q-pigneto'], 600, 'stanza_singola', current_date, 'studio', true, '1', '1')`, "non può scrivere nella tabella direttamente");
await fallisce(salva({ magg: false }), "senza 18 anni non si salva");
await fallisce(salva({ meta: "inventata" }), "destinazione che non esiste");
await fallisce(salva({ zone: "array['q-pigneto','atlantide']" }), "quartiere che non esiste");
await fallisce(salva({ zone: "array['sapienza']" }), "una destinazione non è un quartiere dove vivere");
await fallisce(salva({ zone: "array[]::text[]" }), "nessun quartiere scelto");
await fallisce(salva({ budget: 50 }), "budget troppo basso");
await fallisce(salva({ budget: 9000 }), "budget troppo alto");
await fallisce(salva({ minuti: 37 }), "minuti non ammessi");
await fallisce(salva({ tipo: "castello" }), "tipo di alloggio non ammesso");
await fallisce(salva({ chi: "<script>" }), "valore non ammesso per studio/lavoro");
await fallisce(salva({ da: "current_date - 200" }), "data troppo indietro");
await fallisce(salva({ da: "current_date + 900" }), "data troppo avanti");
await db.exec(salva({ zone: "array['q-pigneto','q-san-lorenzo','q-pigneto']" })); ok("richiesta salvata");
r = await q(`select * from public.richieste`);
verifica(r.length === 1 && r[0].zone.length === 2 && r[0].budget === 600, "legge la propria richiesta, quartieri senza doppioni");
await db.exec(salva({ budget: 650, zone: "array['q-san-lorenzo']" }));
r = await q(`select * from public.richieste`);
verifica(r.length === 1 && r[0].budget === 650 && r[0].zone.length === 1, "salvare di nuovo aggiorna, non duplica");
await fallisce(`update public.richieste set budget = 1 where utente = '${id(1)}'`, "non può modificare la tabella direttamente");
await fallisce(`delete from public.richieste`, "non può cancellare dalla tabella direttamente");
r = await q(`select public.esporta_dati() j`);
verifica(r[0].j.account.email === "u1@example.org" && r[0].j.richiesta.budget === 650, "esporta i propri dati");

console.log("Utente 2");
await come(id(2));
r = await q(`select * from public.richieste`);
verifica(r.length === 0, "non vede la richiesta degli altri");
await db.exec(salva({ budget: 500, zone: "array['q-san-lorenzo','q-testaccio']" })); ok("richiesta salvata");
r = await q(`select public.esporta_dati() j`);
verifica(r[0].j.richiesta.budget === 500 && r[0].j.account.email === "u2@example.org", "esporta solo i propri dati");

console.log("Numeri pubblici");
await come("", "anon");
r = (await q(`select public.richieste_per_zona() j`))[0].j;
const zona = (j, z) => j.zone.find((x) => x.zona === z);
verifica(r.totale === 2 && zona(r, "q-san-lorenzo").richieste === 2 && zona(r, "q-testaccio").richieste === 1, "conteggi per quartiere corretti");
verifica(zona(r, "q-san-lorenzo").budget_tipico === null, "con meno di 5 richieste il budget non esce");
for (let i = 3; i <= 5; i++) { await come(id(i)); await db.exec(salva({ budget: 400 + i * 100, zone: "array['q-san-lorenzo']" })); }
await come("", "anon");
r = (await q(`select public.richieste_per_zona() j`))[0].j;
verifica(zona(r, "q-san-lorenzo").richieste === 5 && zona(r, "q-san-lorenzo").budget_tipico === 700, "da 5 richieste esce il budget tipico (mediana di 500, 650, 700, 800, 900 = 700)");
verifica(zona(r, "q-testaccio").budget_tipico === null, "ma non per i quartieri con meno di 5");

console.log("Richieste vecchie e cancellazione");
await db.exec(`reset role; update public.richieste set aggiornata = now() - interval '100 days' where utente = '${id(5)}'`);
await come("", "anon");
r = (await q(`select public.richieste_per_zona() j`))[0].j;
verifica(r.totale === 4 && zona(r, "q-san-lorenzo").richieste === 4, "una richiesta non confermata da 100 giorni non si conta più");
await come(id(5));
await db.exec(salva({ zone: "array['q-san-lorenzo']" }));
await come("", "anon");
r = (await q(`select public.richieste_per_zona() j`))[0].j;
verifica(r.totale === 5, "salvarla di nuovo la rende di nuovo attiva");
await come(id(2));
await db.exec(`select public.elimina_account()`);
await db.exec(`reset role`);
r = await q(`select (select count(*)::int from auth.users where id = '${id(2)}') u, (select count(*)::int from public.richieste where utente = '${id(2)}') ri, (select count(*)::int from public.richieste) tot`);
verifica(r[0].u === 0 && r[0].ri === 0 && r[0].tot === 4, "elimina account: spariscono account e richiesta, gli altri restano");

console.log(process.exitCode ? "\nQUALCOSA NON VA" : "\nTutto a posto");
