# Premio Internazionale Adriano – Città di Tivoli

Copia di lavoro dei file del sito del Premio Internazionale Adriano – Città di Tivoli, un progetto dell'Associazione Culturale
Tivoli Cantiere Cultura. Il sito è realizzato e gestito da Tritype S.r.l.

Il sito pubblicato vive nel repository `premio-adriano`, sul ramo `main`: le modifiche si fanno lì.

Sito statico: pagine HTML, un foglio di stile e poche righe di JavaScript. Non usa cookie né servizi esterni.

## Cosa c'è

| File | A cosa serve |
|---|---|
| `index.html` | La pagina principale: ogni sezione ha un commento di intestazione |
| `privacy.html` | Informativa privacy e cookie |
| `note-legali.html` | Dati della società, diritti sui contenuti, accessibilità |
| `404.html` | Pagina mostrata quando un indirizzo non esiste |
| `css/` | Colori, carattere, impaginazione |
| `js/app.js` | Menu su telefono e pulsante «Copia indirizzo» |
| `cerimonia-lancio-2026.ics` | File per il pulsante «Aggiungi al calendario» |
| `img/` | Immagini e icone |
| `fonts/` | Carattere Titillium Web con la sua licenza |
| `strumenti/` | Modello dell'immagine per i social e strumento per le anteprime |

## Come fare una modifica

1. Si cambia il file: i testi in `index.html`, l'aspetto in `css/stile.css`.
2. Si controlla la pagina sul proprio computer: dalla cartella del sito `python3 -m http.server 8000`,
   poi si apre `http://localhost:8000`.
3. Si salva la modifica nel ramo `main`: il sito si aggiorna da solo in uno o due minuti.

## Collegare un dominio

1. In «Settings», «Pages», campo «Custom domain»: scrivere il dominio e salvare.
2. Nei DNS del dominio: quattro record `A` sul dominio senza `www`, verso `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153` e `185.199.111.153`, e un record `CNAME` per `www` verso
   `matteomonaco1996-code.github.io`.
3. Quando GitHub ha verificato il dominio, spuntare «Enforce HTTPS». Può servire fino a un giorno.
4. Nel sito: aggiornare `og:url` e `og:image` in `index.html` e togliere la riga `noindex` dalle pagine
   da far trovare sui motori di ricerca.

## Colori e carattere

| | |
|---|---|
| Ambra | `#F9A72B` |
| Nero | `#231F20` |
| Bordeaux | `#7D1531` |
| Avorio | `#FBF5E9` |

Il carattere è Titillium Web, nei pesi 400, 600 e 700, con licenza SIL Open Font License.

## Diritti

Testi, immagini e grafica sono protetti dal diritto d'autore e non possono essere riutilizzati senza
autorizzazione. Il carattere tipografico mantiene la propria licenza, riportata nella cartella `fonts`.
