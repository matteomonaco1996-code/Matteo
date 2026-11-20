# Premio Internazionale Adriano – Città di Tivoli · sito

Sito di presentazione del Premio e della cerimonia di lancio dell'11 dicembre 2026 a Villa d'Este.

- Progetto: Associazione Culturale Tivoli Cantiere Cultura
- Realizzazione, gestione e pubblicazione del sito: Tritype S.r.l.
- Stato: pronto per la pubblicazione su GitHub Pages. Resta fuori dai motori di ricerca (`noindex`) finché
  non ha il dominio definitivo

> I file di questa cartella sono pubblici. Non vanno aggiunti documenti del committente (lettere, dossier,
> file di stampa) né dati che non devono comparire sul sito.

Lo stile segue i materiali del Premio (targa 2026 e dossier), non l'identità Tritype.

## Come vederlo sul proprio computer

Sito statico, senza installazioni. Dalla cartella del sito:

```
python3 -m http.server 8000
```

poi apri `http://localhost:8000`. Aprendo `index.html` con un doppio clic alcuni browser non caricano
il carattere tipografico.

## Cosa c'è nella cartella

| File | A cosa serve |
|---|---|
| `index.html` | La pagina principale. I testi si modificano qui: ogni sezione ha un commento di intestazione |
| `privacy.html` | Informativa privacy e cookie |
| `note-legali.html` | Dati della società, diritti sui contenuti, accessibilità |
| `404.html` | Pagina mostrata quando un indirizzo non esiste |
| `css/stile.css` | Colori, carattere, impaginazione |
| `css/senza-js.css` | Caricato solo se JavaScript è disattivato: tiene il menu sempre visibile |
| `js/app.js` | Menu su telefono e pulsante «Copia indirizzo» |
| `cerimonia-lancio-2026.ics` | File per il pulsante «Aggiungi al calendario» |
| `img/` | Moneta, logo Tivoli Cantiere Cultura, titolo «Premio Adriano 2026», icone, anteprima social |
| `fonts/` | Carattere Titillium Web con la sua licenza |
| `.nojekyll` | File vuoto: dice a GitHub Pages di pubblicare i file così come sono |
| `strumenti/` | Modello dell'immagine per i social e strumento per il link di anteprima |

## Pubblicazione su GitHub Pages

1. **Creare il repository.** Su github.com: «New repository», nome `premio-adriano`, visibilità «Public»,
   senza README né altri file.
2. **Caricare i file.** Il contenuto di questa cartella va nella radice del repository: `index.html` deve
   stare al primo livello, non dentro una sottocartella.
3. **Attivare Pages.** Nel repository: «Settings», poi «Pages». In «Build and deployment» scegliere
   «Deploy from a branch», ramo `main`, cartella `/ (root)`, e salvare.
4. **Aspettare un paio di minuti.** Il sito risponde a `https://NOME-UTENTE.github.io/premio-adriano/`.
   L'indirizzo compare anche in cima alla pagina «Pages».

Da quel momento ogni modifica salvata nel ramo `main` va online da sola in uno o due minuti.

### Quando arriva il dominio dedicato

1. In «Settings», «Pages», campo «Custom domain»: scrivere il dominio e salvare.
2. Dal pannello di chi vende il dominio, impostare i DNS:
   - quattro record `A` sul dominio senza `www`, verso `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` e `185.199.111.153`;
   - un record `CNAME` per `www`, verso `NOME-UTENTE.github.io`.
3. Quando GitHub ha verificato il dominio, spuntare «Enforce HTTPS». Può servire fino a un giorno.
4. Nel sito: mettere l'indirizzo completo in `og:image` (in `index.html`), togliere la riga `noindex` dalle
   pagine da far trovare su Google, aggiornare la data nelle pagine legali.

Se un giorno il sito passa a un altro hosting, va riscritta la parte della privacy che nomina GitHub.

## Come fare una modifica

1. Si cambia il file: i testi in `index.html`, l'aspetto in `css/stile.css`.
2. Si controlla la pagina sul proprio computer.
3. Si salva la modifica nel ramo `main` del repository: il sito si aggiorna da solo.

Per far vedere una modifica a qualcuno prima di metterla online c'è lo strumento
`strumenti/anteprima-online.py`, che costruisce una pagina unica con la fascia «Bozza per convalida»:

```
python3 strumenti/anteprima-online.py . anteprima.html
```

## Decisioni prese

Dal referente del progetto per Tritype, tra il 19 e il 20 novembre 2026.

- Il sito è pubblicato da Tritype S.r.l., che è anche titolare del trattamento dei dati.
- Si parte da GitHub Pages. Il dominio dedicato si compra dopo e sarà intestato a Tritype S.r.l.
- I sette relatori della tavola rotonda sono pubblicati come nel programma di massima, con la presenza RAI
  indicata «in corso di definizione».
- L'email di contatto del sito è `tritype@tritype.it`. Tritype inoltra le richieste all'organizzazione.
- Nella sezione partner compaiono anche Ministero della Cultura e RAI.
- La versione inglese si farà in un secondo momento.

## Ancora da chiudere

- [ ] **Conferme dei partner.** Agli atti c'è solo il patrocinio del Comune di Tivoli. Per Regione Lazio,
      Istituto VILLAE, Ministero della Cultura e RAI serve una conferma scritta, con la dicitura da usare.
- [ ] **Loghi dei partner.** Oggi ci sono solo i nomi. Servono i file ufficiali forniti dagli enti, in SVG
      o PNG con fondo trasparente. Come inserirli è scritto nel commento della sezione in `index.html`.
      In `img/partner/` c'è lo stemma di Tivoli preso dal dossier: è piccolo e non è usato.
- [ ] **Relatori.** Vanno aggiornati a ogni conferma o rinuncia.
- [ ] **Ingresso su invito.** È una deduzione dalla lettera («saranno invitati a partecipare»).
- [ ] **Orario di chiusura.** La lettera dice 19:00 nel testo e 19:30 nel programma. Il sito usa 19:30.
- [ ] **Nome del Premio.** Il dossier dice «Premio Internazionale Adriano – Città di Tivoli», il patrocinio
      del Comune è concesso al «Premio Culturale Internazionale Adriano – Città di Tivoli». Il sito usa
      il primo.
- [ ] **Riconoscimenti 2026.** Il dossier parla di un Premio speciale a una personalità, la lettera di
      riconoscimenti a più «esponenti». Il sito riporta entrambe le cose.
- [ ] **Fotografia della moneta.** Viene dal file di stampa della targa. Provenienza e diritti d'uso sul web
      non sono verificati e nelle note legali manca il credito. La risoluzione è 508 px: per gli schermi ad
      alta densità ne serve una da almeno 1000 px.
- [ ] **Privacy.** Va riletta da chi segue gli aspetti legali per Tritype. Il punto delicato è l'hosting:
      GitHub è una società americana e registra gli indirizzi IP dei visitatori.

Nella cartella `fonts/` sono rimasti i file della prima versione (Marcellus, Gilda Display, Figtree e le
loro licenze). Il sito non li usa: si possono cancellare.

## Privacy e aspetti tecnici

- **Nessun cookie e nessun tracciamento.** Il sito non usa cookie, statistiche o contenuti di terzi, quindi
  non serve il banner di consenso. Anche il carattere tipografico è ospitato sul sito.
- **Informativa privacy** (art. 13 GDPR) con Tritype S.r.l. come titolare, e pagina di note legali con i
  dati che la legge chiede a una società sul proprio sito (art. 2250 c.c., art. 35 DPR 633/1972, art. 7
  d.lgs. 70/2003).
- **Blocco dei contenuti esterni.** Ogni pagina dichiara una Content Security Policy che consente solo
  file del sito stesso. GitHub Pages non permette di impostare altre intestazioni di sicurezza sul server.
- **Accessibilità.** Struttura a titoli, contrasti, navigazione da tastiera e testi alternativi sono stati
  verificati con uno strumento automatico (axe, regole WCAG 2.1 AA) a larghezze da 320 a 1920 px. Non c'è
  stata una prova con lettori di schermo né su dispositivi reali.
- **Funziona senza JavaScript.** I contenuti si leggono tutti. Con JavaScript disattivato il menu resta
  aperto.

Se si aggiunge un modulo di contatto, una newsletter, le candidature online, statistiche di visita, video
o mappe, la privacy va aggiornata prima, e quasi sempre serve il banner dei cookie.

## Da dove vengono i contenuti

| Sezione | Fonte |
|---|---|
| Il Premio, missione, visione, categorie, percorso, iniziative, organi, livelli di partnership | Dossier sintetico 2026–2029 |
| Cerimonia, programma, relatori | Lettera di invito all'evento (novembre 2026) |
| Dicitura del patrocinio comunale | Lettera di patrocinio del Comune di Tivoli (ottobre 2026) |
| Colori, moneta, logo, titolo | File di stampa della targa 2026 |
| Dati di Tritype S.r.l. | Ricerca online, confermati e completati dal referente |

Aggiunti rispetto ai documenti: l'indirizzo di Villa d'Este (Piazza Trento 5) e la frase su Adriano
ricordato per i viaggi, l'architettura e l'apertura verso le altre culture.

## Cosa è stato lasciato fuori, e perché

- **Importi delle sponsorizzazioni** e ripartizione del budget: il dossier li definisce «indicativi».
  Pubblicarli fissa un prezzo prima di ogni trattativa. In pagina ci sono solo i nomi dei livelli.
- **Indicatori di successo (KPI):** documento interno.
- **Loghi presi dal web e stemma del Comune:** nella sezione partner entrano solo file ufficiali forniti
  dagli enti. La lettera di patrocinio impone una dicitura testuale e non parla dello stemma.
- **Fotografie di Villa d'Este e Villa Adriana:** non ne sono state fornite. Le riproduzioni di beni
  culturali a scopo promozionale richiedono l'autorizzazione dell'ente che li ha in consegna.

## Dicitura obbligatoria del Comune

La concessione del patrocinio comporta l'obbligo di esporre sul materiale dell'iniziativa la dicitura
**«Con il patrocinio dell'Amministrazione Comunale di Tivoli»**. È nella parte alta della pagina e nel piè di
pagina: non va modificata né rimossa.

## Colori e carattere

| | |
|---|---|
| Ambra | `#F9A72B` |
| Nero | `#231F20` |
| Bordeaux (punto del logo) | `#7D1531` |
| Avorio (fondi chiari) | `#FBF5E9` |

I primi tre sono letti dal file di stampa della targa. L'avorio è un fondo neutro aggiunto per la lettura.

Tutto il sito usa un solo carattere, **Titillium Web**, nei pesi 400, 600 e 700. È il carattere del sistema
di design dei siti della pubblica amministrazione italiana ed è distribuito con licenza SIL Open Font License.

Il titolo «Premio Adriano 2026» e il logo Tivoli Cantiere Cultura sono tracciati vettoriali estratti dal file
di stampa, non ricomposti con un carattere simile.

## Dopo l'11 dicembre

La parte alta della pagina e la sezione «La cerimonia di lancio» sono scritte per l'evento. A evento concluso
vanno sostituite con il racconto della serata e, quando sarà pronto il regolamento, con le candidature 2027.
Prima di annunciare bandi con borse di studio o premi in denaro (per esempio Adriano Next) va verificato se
rientrano tra le esclusioni previste per i concorsi a premi (DPR 430/2001, art. 6).
