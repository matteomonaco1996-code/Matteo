# Sito Tritype

È un sito statico (Astro) con un pannello di modifica (Pages CMS). Il cliente cambia **solo testi e foto** e non può toccare struttura e grafica.

```
Cliente → Pages CMS → salva i file su GitHub → Cloudflare Pages ricostruisce → online in circa 1 minuto
```

Questa cartella è pronta per diventare un repository a sé. `.pages.yml` deve stare nella **radice** del repository, quindi Pages CMS non la legge finché resta una sottocartella.

## Dove stanno le cose

| File | Cosa contiene | Chi lo modifica |
|---|---|---|
| `src/contenuti/home.yml` | Testi della pagina principale | Cliente, dal pannello |
| `src/contenuti/sito.yml` | Ragione sociale, P.IVA, contatti, logo, social | Cliente, dal pannello |
| `src/contenuti/privacy.yml` | Privacy policy | Cliente, dal pannello |
| `src/assets/immagini/` | Foto caricate dal pannello | Cliente, dal pannello |
| `.pages.yml` | Quali campi vede il cliente e con quali limiti | Noi |
| `src/pages`, `src/layouts`, `src/styles` | Struttura e grafica | Noi |

Le foto vengono ridimensionate e convertite in WebP in automatico (da 480 a 1600 px). Il cliente può caricare la foto originale del telefono. Gli iPhone però salvano in HEIC, che va prima convertito in JPG.

## Prima della messa online

- [ ] Sostituire tutti i `[DA INSERIRE: …]` (`grep -rn "DA INSERIRE" src/contenuti`)
- [ ] Caricare il logo ufficiale (`Tritype – logo sito.jpeg`) dal pannello, in *Dati aziendali → Logo*. Finché manca, compare il nome in testo semplice. Il wordmark non va ricreato con un font simile.
- [ ] Mettere il dominio vero in `astro.config.mjs` (`site:`)
- [ ] Inserire il testo della privacy policy fornito dal consulente
- [ ] Avere il consenso del team prima di pubblicare nomi e foto

## Sviluppo in locale

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Messa online (una volta sola)

1. **Repository**: creare un repository GitHub con il contenuto di questa cartella.
2. **Cloudflare Pages** → *Create project* → collegare il repository.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Il piano gratuito ammette l'uso commerciale. Vercel nel piano gratuito invece no.
3. **Dominio**: collegarlo da Cloudflare Pages → *Custom domains*.
4. **Pages CMS**: entrare su [app.pagescms.org](https://app.pagescms.org) con GitHub, installare la GitHub App sul repository e aprirlo.
5. **Invitare il cliente** dalle impostazioni del repository in Pages CMS → *Collaborators*, inserendo la sua email. Non gli serve un account GitHub. Può modificare contenuti e foto, ma non `.pages.yml` e non può invitare altri.

## Cosa sapere

- **Errori di contenuto**: se un salvataggio produce un file non valido, la ricostruzione fallisce e resta online la versione precedente. Il sito non si rompe, ma la modifica non appare. Le notifiche di build fallita vanno mandate a noi, nelle impostazioni di Cloudflare Pages.
- **Se Pages CMS chiudesse**: i contenuti sono normali file YAML nel repository. Si collega un altro pannello (Decap, Sveltia, Tina) senza rifare il sito, oppure si installa Pages CMS su un server nostro.
- **Modulo di contatto**: non c'è. I contatti sono link diretti (email, telefono, mappa). Per aggiungerlo servono un servizio esterno (Web3Forms, Formspree) e l'aggiornamento della privacy policy.
- **Font**: Inter, ospitato dal sito stesso e non caricato da Google Fonts, così non si inviano dati a terzi.
