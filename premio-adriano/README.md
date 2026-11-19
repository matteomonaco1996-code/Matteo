# Premio Internazionale Adriano – Città di Tivoli · landing page

Pagina di presentazione del Premio e della cerimonia di lancio dell'11 dicembre 2026 a Villa d'Este.

- **Committente / progetto:** Associazione Culturale Tivoli Cantiere Cultura
- **Realizzazione e gestione del sito:** Tritype Srl
- **Stato:** bozza, non pubblicata e non indicizzabile (`noindex`) finché non si completa la lista qui sotto

> Questo repository è pubblico. Per questo la versione qui dentro non contiene i nomi dei relatori né
> recapiti personali, e non vanno aggiunti documenti del committente (lettere, dossier, file di stampa).

Lo stile segue i materiali del Premio (targa 2026 e dossier), non l'identità Tritype.

## Come vederla

Sito statico, senza installazioni. Dalla cartella `premio-adriano`:

```
python3 -m http.server 8000
```

poi apri `http://localhost:8000`. Aprire `index.html` con un doppio clic funziona, ma alcuni browser
bloccano i caratteri tipografici caricati da file locale.

## Cosa c'è nella cartella

| File | A cosa serve |
|---|---|
| `index.html` | Tutta la pagina. I testi si modificano qui, sezione per sezione (ogni blocco ha un commento di intestazione) |
| `privacy.html` | Informativa privacy, in bozza |
| `css/stile.css` | Colori, caratteri, impaginazione |
| `js/app.js` | Menu su telefono, comparsa delle sezioni, pulsante «Copia indirizzo» |
| `cerimonia-lancio-2026.ics` | File per il pulsante «Aggiungi al calendario» |
| `img/` | Moneta, logo Tivoli Cantiere Cultura, titolo «Premio Adriano 2026», icone, anteprima social |
| `fonts/` | Caratteri ospitati sul sito, con le rispettive licenze |
| `strumenti/anteprima.html` | Modello dell'immagine di anteprima social (1200×628 px) |

## Prima di pubblicare

Sono tutte cose che non si possono ricavare dai materiali ricevuti. Finché restano aperte, la pagina non va messa online.

**Conferme dal committente**

- [ ] **Relatori della tavola rotonda.** In questa versione c'è un segnaposto: i nomi del «programma di
      massima» vanno inseriti solo dopo la conferma di ciascuno.
- [ ] **Diciture istituzionali.** «Con il contributo della Regione Lazio» e «In partnership con l'Istituto
      VILLAE» sono riprese dalla lettera, ma non abbiamo visto gli atti. Verificare la formula esatta che
      ciascun ente richiede. L'unica documentata è quella del Comune (vedi sotto).
- [ ] **Partecipazione su invito.** È una deduzione dalla lettera («saranno invitati a partecipare»).
      Se l'evento è aperto al pubblico va cambiata la scheda dell'evento.
- [ ] **Orario di chiusura.** La lettera dice 17:00–19:00 nel testo e 17:00–19:30 nel programma. La pagina e
      il file calendario usano 19:30.
- [ ] **Titolo del convegno.** Nei materiali compare in tre forme («…genera futuro», «…genera Futuro»,
      «…genera il futuro»). La pagina usa ovunque la forma del dossier: «La memoria che genera futuro».
- [ ] **Nome del Premio.** Il dossier lo chiama «Premio Internazionale Adriano – Città di Tivoli»; il
      patrocinio del Comune è concesso al «Premio Culturale Internazionale Adriano – Città di Tivoli».
      La pagina usa il nome del dossier: va deciso quale sia quello ufficiale.
- [ ] **Riconoscimenti 2026.** Il dossier parla di un Premio speciale a una personalità; la lettera di
      riconoscimenti a più «esponenti». La pagina riporta entrambe le cose senza numeri.
- [ ] **Contatti.** In questa versione c'è un segnaposto al posto dell'email. Email ed eventuale telefono
      vanno inseriti con l'assenso dell'interessato; il pulsante «Richiedi il dossier partner» va poi
      puntato allo stesso indirizzo.
- [ ] **Immagine della moneta.** Viene dal file di stampa della targa. Verificare la provenienza della
      fotografia e i diritti d'uso sul web. Risoluzione attuale 508 px: per uno schermo ad alta densità ne
      servirebbe una da almeno 1000 px.

**Dati da inserire**

- [ ] Dati societari di Tritype Srl nel piè di pagina e nella privacy (sede legale, P.IVA, REA, capitale sociale).
- [ ] Titolare del trattamento per i contatti ricevuti via email, fornitore di hosting e data nella privacy.
- [ ] Dominio definitivo: `og:image` in `index.html` deve diventare un indirizzo completo
      (`https://dominio/img/anteprima-1200x628.jpg`), altrimenti i social non mostrano l'anteprima.
- [ ] Togliere `<meta name="robots" content="noindex, nofollow">` da `index.html`.

Per trovare i segnaposto: cerca `DA INSERIRE` e `DA CONFERMARE` nei file. In pagina sono evidenziati in giallo.

## Da dove vengono i contenuti

| Sezione | Fonte |
|---|---|
| Il Premio, missione, visione, categorie, percorso, iniziative, governance, livelli di partnership | Dossier sintetico 2026–2029 (13/10/2026) |
| Evento e programma | Lettera di invito all'evento (novembre 2026) |
| Dicitura del patrocinio comunale | Lettera di patrocinio del Comune di Tivoli (ottobre 2026) |
| Colori, moneta, logo, titolo | File di stampa della targa 2026 |

Non è stato inventato nessun dato. L'indirizzo di Villa d'Este (Piazza Trento 5) è l'unico elemento aggiunto
rispetto ai documenti.

## Cosa è stato lasciato fuori, e perché

- **Importi delle sponsorizzazioni** e ripartizione del budget: il dossier li definisce «indicativi».
  Pubblicarli fissa un prezzo prima di ogni trattativa. In pagina ci sono solo i nomi dei livelli e il
  pulsante per chiedere il dossier.
- **Elenco «Partnership» del dossier:** è un elenco di interlocutori a cui il progetto si rivolge, non di
  partner acquisiti. Presentarli come partner sarebbe falso.
- **Indicatori di successo (KPI):** documento interno.
- **Stemma del Comune, loghi UNESCO, RAI, Regione, MiC:** la lettera di patrocinio impone una dicitura
  testuale, non concede l'uso dello stemma. Gli altri marchi richiedono autorizzazioni specifiche.
- **Fotografie di Villa d'Este e Villa Adriana:** non ne sono state fornite. Le riproduzioni di beni culturali
  a scopo promozionale richiedono l'autorizzazione dell'ente che li ha in consegna.
- **Categorie e iniziative collegate** sono segnalate in pagina come «prima ipotesi» e «sviluppi allo studio»,
  come nel dossier.

## Dicitura obbligatoria del Comune

La concessione del patrocinio comporta l'obbligo di esporre sul materiale dell'iniziativa la dicitura
**«Con il patrocinio dell'Amministrazione Comunale di Tivoli»**. È nella parte alta della pagina e nel piè di
pagina: non va modificata né rimossa.

## Colori e caratteri

| | |
|---|---|
| Ambra | `#F9A72B` |
| Nero | `#231F20` |
| Bordeaux (punto del logo) | `#7D1531` |
| Avorio (fondi chiari) | `#FBF5E9` |

I primi tre sono letti dal file di stampa della targa. L'avorio è un fondo neutro aggiunto per la lettura.

- **Titoli:** Marcellus. Le sole cifre sono in Gilda Display, perché in Marcellus «11» si legge come «II».
- **Testi:** Figtree.
- **Titolo «Premio Adriano 2026» e logo Tivoli Cantiere Cultura:** tracciati vettoriali estratti dal file di
  stampa, non ricomposti con un carattere simile.

Tutti i caratteri hanno licenza SIL Open Font License e sono ospitati nella cartella `fonts`: la pagina non
chiama servizi esterni e non usa cookie.

## Dopo l'11 dicembre

La parte alta della pagina e la sezione «Cerimonia di lancio» sono scritte per l'evento. A evento concluso
vanno sostituite con il racconto della serata e, quando sarà pronto il regolamento, con le candidature 2027.
Prima di annunciare bandi con borse di studio o premi in denaro (per esempio Adriano Next) va verificato se
rientrano tra le esclusioni previste per i concorsi a premi (DPR 430/2001, art. 6).
