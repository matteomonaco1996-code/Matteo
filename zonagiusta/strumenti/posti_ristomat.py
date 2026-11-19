#!/usr/bin/env python3
"""Conta i posti di RistoMat per quartiere e genera dati/posti.js.

Uso:
    python3 strumenti/posti_ristomat.py ../ristomat/locali.js

RistoMat è la lista personale di Matteo: il numero di posti dice dove lui ha trovato cose
buone, non quanto è vivo un quartiere. Sulla pagina è presentato così.
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ETICHETTE = {  # tipo di RistoMat -> (singolare, plurale)
    "trattoria": ("trattoria", "trattorie"), "ristorante": ("ristorante", "ristoranti"),
    "pizza": ("pizzeria", "pizzerie"), "vino": ("enoteca", "enoteche"), "bar": ("bar", "bar"),
    "dolce": ("posto per dolci e caffè", "posti per dolci e caffè"),
    "mondo": ("cucina dal mondo", "cucine dal mondo"), "street": ("street food", "street food"),
    "pesce": ("posto di pesce", "posti di pesce"), "carne": ("posto di carne", "posti di carne"),
    "bottega": ("bottega", "botteghe"),
}


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    testo = Path(sys.argv[1]).read_text("utf-8")
    meta = json.loads(re.search(r"window\.RISTOMAT_META\s*=\s*(\{.*?\});", testo, re.S).group(1))
    posti = json.loads(re.search(r"window\.RISTOMAT\s*=\s*(\[.*\]);", testo, re.S).group(1))
    per_q = defaultdict(Counter)
    for p in posti:
        if p.get("c") == "Roma" and p.get("q"):
            per_q[p["q"]][p.get("t", "altro")] += 1
    out = {}
    for q, c in per_q.items():
        tipi = [[ETICHETTE[t][0 if n == 1 else 1], n] for t, n in c.most_common() if t in ETICHETTE]
        out[q] = {"n": sum(c.values()), "tipi": tipi[:4]}
    dati = {"aggiornato": meta.get("aggiornato", ""), "q": out}
    f = ROOT / "dati" / "posti.js"
    f.write_text("// Generato da strumenti/posti_ristomat.py: non modificare a mano.\n"
                 "window.ZG_POSTI = " + json.dumps(dati, ensure_ascii=False, separators=(",", ":")) + ";\n", "utf-8")
    print(f"{f.relative_to(ROOT)}: {len(out)} quartieri, {sum(v['n'] for v in out.values())} posti")


if __name__ == "__main__":
    main()
