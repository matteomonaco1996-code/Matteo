# Zona Giusta (prova)

Una guida ai quartieri di Roma per chi cerca casa, studenti fuorisede e giovani lavoratori:
scegli dove studi o lavori e vedi, per ognuno dei 37 quartieri, i minuti porta a porta con
metro, tram e bus. È la prima prova di un progetto più ampio sugli affitti; il nome è provvisorio.

Cosa c'è in questa versione:

- classifica dei quartieri per tempo di viaggio verso 61 destinazioni: 12 sedi universitarie,
  12 tra stazioni, ospedali e zone di uffici, e i 37 quartieri stessi (per chi lavora in un
  quartiere qualsiasi);
- mappa con i quartieri colorati per fascia di tempo e le linee di metro e tram;
- per ogni quartiere: linee usate, metro e tram vicini, linee di bus e notturne,
  posti consigliati da RistoMat;
- **richieste di chi cerca casa**: dove devi arrivare, minuti massimi, quartieri, budget, tipo di
  alloggio, da quando. Si salvano con un codice via email (niente password). In pubblico escono
  solo i numeri per quartiere.

Cosa **non** c'è ancora: proposte di affitto, prezzi delle stanze, contatto tra chi cerca e chi
offre. Nessun dato è stato inventato: dove mancano, la pagina lo dice.

> Prima di aprire le richieste al pubblico leggi **[LEGALE_E_SICUREZZA.md](LEGALE_E_SICUREZZA.md)**:
> elenca cosa è già fatto per sicurezza e GDPR e i passi che restano a te.

## Come si apre

È un sito statico, senza server e senza servizi esterni. Basta pubblicare la cartella
(per esempio con GitHub Pages) oppure servirla in locale:

```bash
python3 -m http.server 8000   # poi apri http://localhost:8000
```

L'indirizzo ricorda la sede scelta: `…/#romatre-ostiense` apre la pagina su Roma Tre.

## File

| File | Contenuto |
| --- | --- |
| `index.html`, `css/stile.css`, `js/app.js` | Pagina, stile, guida ai quartieri |
| `js/richiesta.js` | Modulo della richiesta, accesso con codice, riepilogo |
| `config.js` | Indirizzo e chiave pubblica di Supabase (vuoti = richieste spente) |
| `privacy.html`, `termini.html` | Informativa privacy e termini d'uso (da completare con i tuoi dati) |
| `supabase/schema.sql` | Tabelle, regole di sicurezza e funzioni del database |
| `supabase/luoghi.sql` | Destinazioni e quartieri ammessi: **generato** da `strumenti/luoghi_sql.py` |
| `strumenti/test_database.mjs` | Test delle regole del database (37 controlli) |
| `dati/zone.js` | Tempi, mezzi vicini e tracciati: **generato**, non modificare a mano |
| `dati/posti.js` | Posti di RistoMat per quartiere: **generato** |
| `mappa/roma.js` | Strade, Tevere e parchi (© OpenStreetMap, ODbL), copiato da RistoMat |
| `strumenti/luoghi.py` | Quartieri (gli stessi di RistoMat) e destinazioni |
| `strumenti/tempi_mezzi.py` | Calcola i tempi dagli orari ufficiali e genera `dati/zone.js` |
| `strumenti/posti_ristomat.py` | Conta i posti di RistoMat e genera `dati/posti.js` |
| `vendor/`, `fonts/` | Leaflet e caratteri ospitati sul sito, con licenze |

## Aggiornare i dati

Gli orari cambiano: conviene rigenerare i tempi ogni mese o due.

```bash
curl -L -o gtfs.zip https://romamobilita.it/sites/default/files/rome_static_gtfs.zip
mkdir gtfs && unzip -q gtfs.zip -d gtfs
python3 strumenti/tempi_mezzi.py gtfs              # sceglie da solo un giorno feriale completo
python3 strumenti/posti_ristomat.py ../ristomat/locali.js
python3 strumenti/luoghi_sql.py                    # solo se cambi strumenti/luoghi.py: poi riesegui luoghi.sql su Supabase
```

Lo zip pesa circa 48 MB e non va messo nel repository.

## Richieste: come funzionano

- Una richiesta per persona, legata all'email. Il browser non scrive mai nelle tabelle: passa
  dalla funzione `salva_richiesta()`, che controlla età, date, quartieri e valori ammessi.
- Ognuno legge solo la propria richiesta. `richieste_per_zona()` dà a tutti i conteggi per
  quartiere; il budget tipico (mediana) esce solo da 5 richieste in su.
- Una richiesta conta per 90 giorni dall'ultimo salvataggio.
- Test delle regole, dalla cartella del sito:

```bash
npm install --no-save @electric-sql/pglite@0.5.16
node strumenti/test_database.mjs supabase/schema.sql supabase/luoghi.sql
```

## Come sono calcolati i tempi

- Orari **programmati** del GTFS di Roma Servizi per la Mobilità, non i ritardi reali.
- Partenza dal punto centrale del quartiere; sette partenze tra le 7:50 e le 8:50 di un
  giorno feriale; si mostra la mediana, attesa alla fermata compresa.
- A piedi 4,8 km/h in linea d'aria, +30% per le strade; fermate raggiungibili entro 1 km;
  cambi tra fermate entro 250 m, con almeno un minuto di margine.
- Se andare a piedi è più veloce dei mezzi, si mostra il tempo a piedi.

## Limiti da sapere

- **Un punto per quartiere**: chi abita al bordo può metterci diversi minuti in più o in meno.
- **Rete incompleta**: nel GTFS ci sono metro, tram e bus; mancano i treni regionali e la
  Metromare (Roma–Lido).
- **Metro B e B1** sono mostrate insieme come "Metro B".
- **Orari incompleti in certe date**: il GTFS copre bene solo alcune settimane. Lo strumento
  sceglie il giorno feriale con più corse e avvisa se sono poche.
- **RistoMat** è una lista personale: il numero di posti non misura quanto è vivo un quartiere.
- Le coordinate delle università sono indicative, controllate sui nomi delle fermate vicine;
  quelle di stazioni, ospedali e uffici sono le fermate ufficiali con lo stesso nome.
- Quando la destinazione è un quartiere, il tempo è da centro a centro.

## Fonti e licenze

- Orari e tracciati: Roma Servizi per la Mobilità, GTFS statico, CC BY 3.0 IT.
- Mappa: © OpenStreetMap contributors, ODbL 1.0.
- Componenti di terze parti: vedi `vendor/LICENZE.md`.
