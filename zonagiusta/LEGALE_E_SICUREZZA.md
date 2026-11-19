# Sicurezza, GDPR e obblighi: cosa è fatto e cosa devi fare tu

> Questo documento e i testi di `privacy.html` e `termini.html` sono una base scritta con cura
> ma **non sono una consulenza legale**. Prima di aprire le richieste al pubblico falli rileggere
> da un avvocato o da un consulente privacy. Prima di aprire le **proposte di affitto** serve
> anche un parere sulla mediazione immobiliare (vedi il punto 6).

## 1. Già fatto nel codice

**Privacy by design**
- Senza account il sito non raccoglie nulla: niente analytics, niente cookie di terze parti, niente banner.
- Caratteri, librerie e mappa ospitati sul sito: nessuna chiamata a Google Fonts, CDN o servizi di mappe.
- Richiesta minima: email (solo accesso e comunicazioni sul servizio) più sette campi a scelta chiusa.
  Niente nome, telefono, reddito, documenti o testo libero: non c'è nulla da moderare.
- Le singole richieste non sono visibili a nessun altro utente. In pubblico escono solo i conteggi
  per quartiere; il budget tipico solo da 5 richieste in su.
- Diritti self-service: **Modifica**, **Esporta i miei dati**, **Elimina richiesta e account**.
- Le richieste scadono dai numeri pubblici dopo 90 giorni senza conferma.

**Sicurezza**
- Content Security Policy: il browser esegue solo i file del sito e parla solo con Supabase.
- `referrer` disattivato; link esterni con `noopener`; i testi mostrati sono “escaped”.
- Database con Row Level Security: ognuno legge solo la propria richiesta. Il browser non scrive mai
  nelle tabelle: passa da `salva_richiesta()`, che controlla età, date, quartieri e valori ammessi.
- Niente password (accesso con codice monouso). Nel sito c'è solo la chiave pubblica (`publishable`).
- Le regole sono verificate da `strumenti/test_database.mjs` (37 controlli su un vero Postgres).

## 2. Stato del progetto Supabase

- Progetto **zona-giusta** creato nell'organizzazione di Matteo, regione **Francoforte**, piano gratuito.
- Indirizzo e chiave pubblica sono già in `config.js`.
- Se le tabelle non ci sono ancora: SQL Editor → incolla `supabase/schema.sql` → Run, poi
  `supabase/luoghi.sql` → Run. Si possono rieseguire senza danni.

## 3. Da fare prima di aprire al pubblico (obbligatorio)

1. **Completa i dati** in `privacy.html` e `termini.html`: restano `[CITTÀ]`, `[DATA DI PUBBLICAZIONE]`,
   `[FORNITORE DEL SITO]` e `[FORNITORE EMAIL]`. L'email di contatto è quella usata per RistoMat
   (Matteo-m96@hotmail.it): sarà pubblica, valuta un indirizzo dedicato al progetto.
2. **Firma il DPA** di Supabase (dashboard → documenti legali dell'organizzazione, o supabase.com/legal/dpa).
3. **Auth** (Authentication → Sign In / Providers, URL Configuration, Emails):
   - lascia attivo solo il provider **Email**;
   - Site URL e Redirect URLs = l'indirizzo dove pubblichi il sito;
   - nei modelli **Magic Link** e **Confirm signup** scrivi il testo in italiano e inserisci il
     codice `{{ .Token }}` (il sito chiede il codice; chi si iscrive per la prima volta riceve
     il modello “Confirm signup”);
   - scadenza del codice: 10 minuti.
4. **Email**: il servizio incluso in Supabase è solo per prove (pochissimi invii l'ora). Configura un
   SMTP con server in UE (es. Brevo o Mailjet) in Authentication → SMTP, firma il suo DPA e scrivi
   il nome del fornitore in `privacy.html`.
5. **Pulizia automatica**: Database → Extensions → attiva `pg_cron`, poi esegui il blocco commentato
   in fondo a `schema.sql` (togliendo i `--`). Finché non è attivo, la cancellazione dopo 12 mesi
   promessa nell'informativa va fatta a mano.
6. **Pubblica il sito** in HTTPS (es. GitHub Pages) e scrivi il fornitore in `privacy.html`.
7. **Prova tutto** con un tuo account: richiesta, codice via email, modifica, esporta, elimina.

## 4. Prima di aprire le proposte di affitto (non ancora costruite)

- **Mediazione (L. 39/1989)**: chi mette in contatto due parti per un affare e viene pagato per questo
  deve essere un agente iscritto. Oggi il sito non lo fa (nessun contatto tra le parti, nessun
  compenso) e i termini lo dicono. Con le proposte la situazione cambia: serve un parere legale
  su come guadagnare (abbonamento o prezzo fisso, mai una percentuale sul contratto).
- **Annunci**: classe energetica obbligatoria, divieto di testi discriminatori, moderazione e
  procedura di segnalazione (Digital Services Act).
- **Visibilità delle richieste**: mostrarle a chi offre richiede un nuovo consenso di chi le ha lasciate.
- **Truffe**: verifica di chi offre prima che possa contattare chi cerca.

## 5. Da fare nel tempo

- **Richieste privacy** via email: rispondi entro 30 giorni, dopo aver verificato che chi scrive sia
  il titolare dell'account (es. rispondendo all'email registrata).
- **Violazioni di dati**: valuta il rischio e, se c'è, notifica al Garante entro 72 ore; annota
  comunque l'accaduto. Ruota subito le chiavi in Supabase.
- **Orari dei mezzi**: rigenera `dati/zone.js` ogni mese o due (vedi README).
- **Aggiornamenti**: ogni qualche mese aggiorna supabase-js e Leaflet (`vendor/`).
- **Backup**: controlla quali backup offre il piano Supabase.

## 6. Registro dei trattamenti (modello)

| Trattamento | Dati | Interessati | Base giuridica | Destinatari | Extra UE | Conservazione | Misure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account e accesso | email, 18+, versioni documenti, date | chi lascia una richiesta | contratto | Supabase, fornitore SMTP | SCC (supporto Supabase) | fino a cancellazione o 12 mesi senza conferma | RLS, OTP, HTTPS |
| Richieste | destinazione, minuti, quartieri, budget, tipo, data, studio/lavoro | chi lascia una richiesta | contratto | Supabase | come sopra | come l'account | scrittura solo via funzione server |
| Numeri pubblici | conteggi e mediane per quartiere (dati aggregati) | — | — | pubblico | — | — | soglia di 5 per il budget |
| Log del sito | IP, user agent | visitatori | legittimo interesse | fornitore del sito, Supabase | secondo il fornitore | secondo il fornitore | — |

## 7. Valutazione d'impatto (DPIA): perché non è obbligatoria, oggi

I dati sono pochi, non sensibili, senza profilazione né decisioni automatizzate, e su piccola scala.
Il budget è un dato economico ma non è collegato a nome o identità visibile. Se aggiungerai verifica
dell'identità, dati di reddito o l'incrocio automatico tra richieste e proposte, rifai questa valutazione.

## 8. Limiti noti

- GitHub Pages non permette di impostare header HTTP (es. `frame-ancestors`): la CSP è nel meta tag.
- Chiunque abbia un'email può lasciare una richiesta: i numeri si possono gonfiare con più caselle
  di posta. Finché sono solo conteggi il danno è limitato; va rivisto quando avranno un valore.
