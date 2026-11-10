# RistoMat

Sito statico con la lista Google Maps **“RistoMat”** di Matteo: 673 posti dove
mangiare e bere, cercabili per città, zona di Roma, tipo di locale e nome.

## Cosa fa

- **Ricerca** per nome, via, quartiere o testo delle note (senza badare agli accenti).
- **Dove**: Roma (con 10 zone ricavate dal CAP), Firenze, Venezia, Milano, Bologna, Altrove (con elenco delle località).
- **Cosa**: trattorie, pizzerie, vino, cucine dal mondo, ecc.
- **Le note di Matteo** in evidenza, e filtro “Solo con nota”.
- **Scegli tu per me**: pesca un posto a caso tra quelli filtrati.
- **Mappa** (Leaflet + OpenStreetMap/CARTO) e ordinamento **Più vicini a me** (chiede la posizione al browser).
- Ogni scheda apre il posto o le indicazioni su Google Maps.
- Tema chiaro/scuro automatico, funziona su telefono.

## File

| File | Cosa contiene |
| --- | --- |
| `index.html` | La pagina (HTML, CSS e JavaScript in un solo file) |
| `locali.js` | I dati dei locali, **generati** dallo script qui sotto |
| `correzioni.json` | Correzioni manuali (tipo, città, zona, nota) per singolo locale |
| `strumenti/aggiorna_lista.py` | Scarica la lista da Google Maps e rigenera `locali.js` |

Per vederlo in locale basta aprire `index.html` nel browser (serve la connessione
per mappa e caratteri).

## Aggiornare la lista

Dopo aver aggiunto posti alla lista su Google Maps:

```bash
python3 ristomat/strumenti/aggiorna_lista.py
```

Lo script usa solo la libreria standard di Python. La lista deve restare
condivisa con link pubblico. Lo script legge un endpoint non documentato di
Google Maps: se un giorno smette di funzionare, va adattato.

## Limiti da sapere

- **Il tipo di locale è dedotto dal nome** (e dalla nota, se c’è). Nomi come
  “Cosetta” o “Pipero” non dicono che locale sia, quindi circa un terzo dei posti
  finisce in “Altro”. Si correggono in `correzioni.json`, ad esempio:
  ```json
  "Armando al Pantheon": { "t": "trattoria" }
  ```
  Tipi validi: `pizza`, `trattoria`, `ristorante`, `pesce`, `carne`, `mondo`,
  `vino`, `bar`, `dolce`, `street`, `bottega`, `altro`.
- **Le zone di Roma vengono dal CAP** e sono raggruppamenti larghi (es. 00153 =
  “Trastevere · Testaccio”). Un locale al confine può finire nella zona accanto.
- La lista Google Maps non espone categoria, voto o orari dei locali: il sito
  non li mostra.
