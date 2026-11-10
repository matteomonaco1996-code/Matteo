# Scusa, non stasera

> *Scusa, non stasera.* ~~~ **Anzi sì.**

Sito statico per uscire senza programmare: ti geolocalizzi (o scegli la zona) e
vedi cosa c’è di buono intorno, a fasce di distanza a piedi. I posti sono i 673
della lista Google Maps **“RistoMat”** di Matteo, arricchiti con le dritte di
Matteo, i riassunti delle recensioni di Puntarella Rossa e le guide
Spacedelicious.

## Come funziona

1. **Dove sei?** “Vicino a me” usa il GPS del telefono (la posizione non esce
   dal browser), oppure scegli una zona di Roma, una città o un’altra località.
2. **Che voglia hai?** Come a casa (trattorie e osterie) · A tavola (ristoranti) ·
   Pizza, ovvio · Un calice · Due drink · Dolce & caffè · Giro del mondo ·
   Al volo · Sapore di mare · Brace & carne · Spesa golosa · Da scoprire.
3. I risultati arrivano in fasce: **Sotto casa** (≤ 10 min a piedi),
   **Due passi** (10–25 min), **Vale il viaggio**.
4. **Sorprendimi** pesca un posto a caso tra quelli vicini; **Portami lì** apre
   le indicazioni a piedi su Google Maps.
5. **Solo con una dritta** mostra i posti con una nota di Matteo, una
   recensione di Puntarella Rossa o la presenza in una guida Spacedelicious.

## File

| File | Contenuto |
| --- | --- |
| `index.html` | La pagina (HTML, CSS, JavaScript) |
| `locali.js` | Dati **generati**: non modificarli a mano |
| `recensioni.json` | Riassunti Puntarella Rossa (anno + link) e guide Spacedelicious, per locale |
| `tipi_osm.json` | Tipo di locale da OpenStreetMap per i posti il cui nome non lo dice |
| `correzioni.json` | Correzioni manuali (tipo, città, zona, nota): vincono su tutto |
| `strumenti/aggiorna_lista.py` | Scarica la lista da Google Maps e rigenera `locali.js` |

Dopo aver aggiunto posti su Google Maps, o modificato uno dei file `.json`:

```bash
python3 ristomat/strumenti/aggiorna_lista.py
```

## Limiti da sapere

- **Minuti a piedi**: stima in linea d’aria (+30% per le strade reali), non un
  percorso vero.
- **Tipo di locale**: dedotto dal nome, poi dalle guide, poi da OpenStreetMap.
  Restano circa 100 posti “Da scoprire”. Si correggono in `correzioni.json`, es.
  `"Armando al Pantheon": { "t": "trattoria" }`.
- **Recensioni**: sono riassunti brevi scritti per questo sito, con anno e link
  all’articolo originale. Alcune hanno più di dieci anni: il locale può essere
  cambiato. I posti aggiunti in futuro alla lista non ricevono recensioni in
  automatico.
- **Zone di Roma**: ricavate dal CAP, a gruppi larghi.
- **Niente orari di apertura**: la lista Google Maps non li fornisce.
