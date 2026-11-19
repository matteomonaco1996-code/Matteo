# Zona Giusta (prova)

Una guida ai quartieri di Roma per chi cerca casa da fuorisede: scegli la sede
universitaria e vedi, per ognuno dei 37 quartieri, i minuti porta a porta con metro,
tram e bus. È la prima prova di un progetto più ampio sugli affitti; il nome è provvisorio.

Cosa c'è in questa versione:

- classifica dei quartieri per tempo di viaggio verso 11 sedi (Sapienza, Roma Tre,
  Tor Vergata, Luiss, LUMSA, Cattolica, Foro Italico);
- mappa con i quartieri colorati per fascia di tempo e le linee di metro e tram;
- per ogni quartiere: linee usate, metro e tram vicini, linee di bus e notturne,
  posti consigliati da RistoMat.

Cosa **non** c'è ancora: prezzi delle stanze, annunci, account. Nessun dato sui prezzi è
stato inventato: la pagina dice che mancano.

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
| `index.html`, `css/stile.css`, `js/app.js` | Pagina, stile, logica |
| `dati/zone.js` | Tempi, mezzi vicini e tracciati: **generato**, non modificare a mano |
| `dati/posti.js` | Posti di RistoMat per quartiere: **generato** |
| `mappa/roma.js` | Strade, Tevere e parchi (© OpenStreetMap, ODbL), copiato da RistoMat |
| `strumenti/luoghi.py` | Quartieri (gli stessi di RistoMat) e sedi universitarie |
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
```

Lo zip pesa circa 48 MB e non va messo nel repository.

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
- Le coordinate delle sedi sono indicative, controllate sui nomi delle fermate vicine.

## Fonti e licenze

- Orari e tracciati: Roma Servizi per la Mobilità, GTFS statico, CC BY 3.0 IT.
- Mappa: © OpenStreetMap contributors, ODbL 1.0.
- Componenti di terze parti: vedi `vendor/LICENZE.md`.
