# Premio Internazionale Adriano – Città di Tivoli · sito

Sito di presentazione del Premio e della cerimonia di lancio dell'11 dicembre 2026 a Villa d'Este.

- Progetto: Associazione Culturale Tivoli Cantiere Cultura
- Realizzazione e gestione del sito: Tritype S.r.l.
- Stato: bozza per la convalida. Non è online e non è indicizzabile (`noindex`) finché non si chiude la lista qui sotto

> Questo repository è pubblico. Per questo la versione qui dentro non contiene i nomi dei relatori né
> recapiti personali, e non vanno aggiunti documenti del committente (lettere, dossier, file di stampa).

Lo stile segue i materiali del Premio (targa 2026 e dossier), non l'identità Tritype.

## Come vederlo

Sito statico, senza installazioni. Dalla cartella `premio-adriano`:

```
python3 -m http.server 8000
```

poi apri `http://localhost:8000`. Aprendo `index.html` con un doppio clic alcuni browser non caricano
i caratteri tipografici.

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
| `strumenti/anteprima.html` | Modello dell'immagine di anteprima social (1200×628 px) |

Nella cartella `fonts/` sono rimasti i file della prima versione (Marcellus, Gilda Display, Figtree e le
loro licenze). Il sito non li usa più: si possono cancellare.

## Prima di pubblicare

**Conferme dal committente**

- [ ] **Partner.** Nella sezione «Partner e istituzioni» compaiono Città di Tivoli, Regione Lazio, Istituto
      VILLAE, Ministero della Cultura e RAI. Agli atti c'è solo il patrocinio del Comune. Per gli altri serve
      una conferma scritta dell'ente, con la dicitura esatta da usare e le regole per nome e logo. I loghi si
      inseriscono solo dopo aver ricevuto il file ufficiale.
- [ ] **Relatori della tavola rotonda.** In questa versione c'è un segnaposto: i nomi del «programma di
      massima» vanno inseriti solo dopo la conferma di ciascuno.
- [ ] **Ingresso su invito.** È una deduzione dalla lettera («saranno invitati a partecipare»). Se l'evento
      è aperto al pubblico va cambiata la scheda della cerimonia.
- [ ] **Orario di chiusura.** La lettera dice 17:00–19:00 nel testo e 17:00–19:30 nel programma. La pagina e
      il file calendario usano 19:30.
- [ ] **Titolo del convegno.** Nei materiali compare in tre forme. La pagina usa quella del dossier:
      «La memoria che genera futuro».
- [ ] **Nome del Premio.** Il dossier lo chiama «Premio Internazionale Adriano – Città di Tivoli»; il
      patrocinio del Comune è concesso al «Premio Culturale Internazionale Adriano – Città di Tivoli».
      La pagina usa il nome del dossier.
- [ ] **Riconoscimenti 2026.** Il dossier parla di un Premio speciale a una personalità, la lettera di
      riconoscimenti a più «esponenti». La pagina riporta entrambe le cose.
- [ ] **Contatti.** In questa versione c'è un segnaposto al posto dell'email. Email ed eventuale telefono
      vanno inseriti con l'assenso dell'interessato. Il pulsante «Richiedi il dossier» va poi puntato allo
      stesso indirizzo.
- [ ] **Immagine della moneta.** Viene dal file di stampa della targa. Vanno verificati la provenienza della
      fotografia e i diritti d'uso sul web, e va inserito il credito nelle note legali. La risoluzione
      attuale è 508 px: per gli schermi ad alta densità ne serve una da almeno 1000 px.

**Dati di Tritype S.r.l.**

Trovati online e confermati dal referente del progetto il 19 novembre 2026:

| Dato | Valore inserito |
|---|---|
| Sede | via Pietro Nenni 5, 00019 Tivoli (RM) |
| P.IVA e codice fiscale | 04345721007 |
| REA | RM-760345 |
| Email e telefono | tritype@tritype.it · 0774 336714 |

- [ ] **Capitale sociale.** La legge chiede di indicarlo sul sito (art. 2250 c.c.). Manca: resta come
      segnaposto nel piè di pagina e nelle note legali. La PEC è facoltativa e non è indicata.
- [ ] **Hosting.** Fornitore, Paese dei server e durata di conservazione dei registri vanno scritti nella
      privacy. Da questo dipende anche la frase sul trasferimento dei dati fuori dall'Europa.
- [ ] **Durata di conservazione dei messaggi** e **data di aggiornamento** nelle due pagine legali.

Per trovare i segnaposto: cerca `DA INSERIRE` e `DA CONFERMARE` nei file. In pagina sono evidenziati in giallo.

**Messa online**

- [ ] Dominio definitivo: `og:image` in `index.html` deve diventare un indirizzo completo
      (`https://dominio/img/anteprima-1200x628.jpg`), altrimenti i social non mostrano l'anteprima.
- [ ] Togliere `<meta name="robots" content="noindex, nofollow">` dalle pagine da indicizzare.
- [ ] Impostare sul server le intestazioni indicate più sotto.
- [ ] Far rileggere privacy e note legali a chi segue gli aspetti legali per Tritype.

## Decisioni prese

- Il progetto resta in questo repository, che è pubblico. Relatori ed email di contatto entrano qui solo
  dopo la convalida.
- Il titolare del trattamento è Tritype S.r.l.
- Resta da decidere a quale casella arrivano i messaggi del sito. Oggi il contatto indicato nel dossier
  è di A.G.T. Communications, non di Tritype.
- La versione inglese si farà in un secondo momento.

## Privacy e aspetti tecnici

Cosa è già a posto:

- **Nessun cookie e nessun tracciamento.** Il sito non usa cookie, statistiche o contenuti di terzi, quindi
  non serve il banner di consenso. Anche il carattere tipografico è ospitato sul sito.
- **Informativa privacy** (art. 13 GDPR) con Tritype S.r.l. come titolare, e pagina di note legali con i
  dati che la legge chiede a una società sul proprio sito (art. 2250 c.c., art. 35 DPR 633/1972, art. 7
  d.lgs. 70/2003).
- **Blocco dei contenuti esterni.** Ogni pagina dichiara una Content Security Policy che consente solo
  file del sito stesso.
- **Accessibilità.** Struttura a titoli, contrasti, navigazione da tastiera e testi alternativi sono stati
  verificati con uno strumento automatico (axe, regole WCAG 2.1 AA) a larghezze da 320 a 1920 px. Non c'è
  stata una prova con lettori di schermo né su dispositivi reali.
- **Funziona senza JavaScript.** I contenuti si leggono tutti. Con JavaScript disattivato il menu resta
  aperto.

Cosa cambia se si aggiunge qualcosa:

- Un modulo di contatto, una newsletter o le candidature online richiedono una nuova informativa, il
  consenso dove serve e un posto sicuro dove conservare i dati.
- Statistiche di visita, video incorporati o mappe richiedono l'aggiornamento della privacy e, quasi
  sempre, il banner dei cookie.

Intestazioni da impostare sul server (non si possono dichiarare dentro la pagina):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Da dove vengono i contenuti

| Sezione | Fonte |
|---|---|
| Il Premio, missione, visione, categorie, percorso, iniziative, organi, livelli di partnership | Dossier sintetico 2026–2029 |
| Cerimonia e programma | Lettera di invito all'evento (novembre 2026) |
| Dicitura del patrocinio comunale | Lettera di patrocinio del Comune di Tivoli (ottobre 2026) |
| Colori, moneta, logo, titolo | File di stampa della targa 2026 |

Aggiunti rispetto ai documenti: l'indirizzo di Villa d'Este (Piazza Trento 5) e la frase su Adriano
ricordato per i viaggi, l'architettura e l'apertura verso le altre culture.

## Cosa è stato lasciato fuori, e perché

- **Importi delle sponsorizzazioni** e ripartizione del budget: il dossier li definisce «indicativi».
  Pubblicarli fissa un prezzo prima di ogni trattativa. In pagina ci sono solo i nomi dei livelli.
- **Indicatori di successo (KPI):** documento interno.
- **Stemma del Comune e loghi di enti e aziende:** la lettera di patrocinio impone una dicitura testuale,
  non concede l'uso dello stemma. Gli altri marchi richiedono un'autorizzazione.
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
