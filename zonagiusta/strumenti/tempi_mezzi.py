#!/usr/bin/env python3
"""Calcola i tempi con i mezzi dai quartieri alle destinazioni e genera dati/zone.js.

Le destinazioni sono le sedi di strumenti/luoghi.py (università, stazioni, ospedali, uffici)
più i 37 quartieri stessi, per chi lavora in un quartiere qualsiasi.

Uso:
    python3 strumenti/tempi_mezzi.py CARTELLA_GTFS [AAAAMMGG]

CARTELLA_GTFS contiene il GTFS statico di Roma Mobilità già estratto
(https://romamobilita.it/sites/default/files/rome_static_gtfs.zip, licenza CC BY 3.0 IT).
Senza data usa il primo martedì disponibile negli orari.

Metodo (in breve, i limiti sono scritti anche sulla pagina):
- orario programmato, non i ritardi reali;
- partenza dal punto centrale del quartiere, sette partenze tra le 7:50 e le 8:50:
  il tempo mostrato è la mediana, attesa alla fermata compresa;
- a piedi: 4,8 km/h in linea d'aria, +30% per le strade;
- solo la rete nel GTFS: metro, tram e bus. Niente treni regionali né Metromare.
"""
import bisect
import csv
import datetime
import json
import math
import re
import unicodedata
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "strumenti"))
from luoghi import QUARTIERI, SEDI  # noqa: E402

V_PIEDI = 4800 / 3600 / 1.3      # m/s in linea d'aria (4,8 km/h, +30% di strada)
R_ACCESSO = 1000                 # m in linea d'aria per raggiungere una fermata
R_CAMBIO = 250                   # m in linea d'aria tra due fermate per un cambio
T_CAMBIO = 60                    # s minimi per cambiare mezzo
PARTENZE = [7 * 3600 + 50 * 60 + i * 600 for i in range(7)]   # 7:50 … 8:50
ORIZZONTE = 130 * 60             # s: oltre non cerchiamo
FINESTRA = (6 * 3600 + 30 * 60, 11 * 3600 + 30 * 60)
INF = 10 ** 9


def metri(a, b, c, d):
    k = math.cos(math.radians(a))
    return math.hypot((c - a) * 110570, (d - b) * 111320 * k)


def id_quartiere(nome):
    """Identificativo per l'indirizzo della pagina: solo lettere ASCII, cifre e trattini."""
    t = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode().lower()
    return "q-" + re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def sec(hms):
    h, m, s = hms.split(":")
    return int(h) * 3600 + int(m) * 60 + int(s)


def nome_fermata(n):
    n = re.sub(r"\s*\((MA|MB|MB1|MC|FS|RL|FL\d?|H)(-[A-Z0-9]+)*\)", "", n).strip()
    n = re.sub(r"\s+", " ", n).title().replace("'", "’")
    return re.sub(r"\b(Di|Del|Della|Dei|Degli|Delle|Da|E|A|Al|Alla)\b", lambda m: m.group(0).lower(), n)


def nome_linea(sigla, tipo):
    metro = {"MEA": "Metro A", "MEB": "Metro B", "MEB1": "Metro B", "MEC": "Metro C"}
    if sigla in metro:
        return metro[sigla]
    return ("Tram " if tipo == "0" else "Bus ") + sigla


def semplifica(pts, tol):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[1] - a[1], b[0] - a[0]
    n = (dx * dx + dy * dy) ** .5 or 1e-12
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * (pts[i][1] - a[1]) - dx * (pts[i][0] - a[0])) / n
        if d > dmax:
            dmax, idx = d, i
    if dmax <= tol:
        return [a, b]
    return semplifica(pts[:idx + 1], tol)[:-1] + semplifica(pts[idx:], tol)


def codifica(pts):
    out, plat, plon = [], 0, 0
    for la, lo in pts:
        a, b = round(la * 1e5), round(lo * 1e5)
        out += [a - plat, b - plon]
        plat, plon = a, b
    return out


def carica(g, data):
    servizi_per_data = defaultdict(set)
    for r in csv.DictReader(open(g / "calendar_dates.txt", encoding="utf-8-sig")):
        if r["exception_type"] == "1":
            servizi_per_data[r["date"]].add(r["service_id"])
    righe_corse = list(csv.DictReader(open(g / "trips.txt", encoding="utf-8-sig")))
    if not data:
        # Il GTFS copre bene solo alcune settimane: si prende il giorno tra martedì e giovedì
        # con più corse, così non si finisce su una data con gli orari incompleti o su un festivo.
        per_servizio = defaultdict(int)
        for r in righe_corse:
            per_servizio[r["service_id"]] += 1
        feriali = [d for d in servizi_per_data
                   if datetime.date(int(d[:4]), int(d[4:6]), int(d[6:])).weekday() in (1, 2, 3)]
        data = max(sorted(feriali), key=lambda d: sum(per_servizio[s] for s in servizi_per_data[d]))
    servizi = servizi_per_data[data]
    if not servizi:
        sys.exit(f"Nessun servizio il {data}")

    linee = {r["route_id"]: (r["route_short_name"] or r["route_id"], r["route_type"])
             for r in csv.DictReader(open(g / "routes.txt", encoding="utf-8-sig"))}
    corsa_linea, corsa_forma = {}, {}
    for r in righe_corse:
        if r["service_id"] in servizi:
            corsa_linea[r["trip_id"]] = r["route_id"]
            corsa_forma[r["trip_id"]] = r["shape_id"]
    if len(corsa_linea) < 20000:
        print(f"ATTENZIONE: il {data} ha solo {len(corsa_linea)} corse, gli orari sembrano incompleti")

    fermate, idx = [], {}
    for r in csv.DictReader(open(g / "stops.txt", encoding="utf-8-sig")):
        idx[r["stop_id"]] = len(fermate)
        fermate.append((r["stop_name"], float(r["stop_lat"]), float(r["stop_lon"])))

    # Orari: tutte le corse del giorno servono per sapere quali linee passano da una fermata
    # (anche le notturne); i collegamenti si tengono solo nella finestra del mattino.
    per_corsa = defaultdict(list)
    linee_fermata = defaultdict(set)
    n_fermate_corsa = defaultdict(int)
    with open(g / "stop_times.txt", encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        h = next(rd)
        ci, ai, di, si, qi = (h.index(c) for c in ("trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"))
        for r in rd:
            t = r[ci]
            li = corsa_linea.get(t)
            if li is None:
                continue
            s = idx.get(r[si])
            if s is None:
                continue
            linee_fermata[s].add(li)
            n_fermate_corsa[t] += 1
            a = sec(r[ai])
            if FINESTRA[0] <= a <= FINESTRA[1]:
                per_corsa[t].append((int(r[qi]), s, a, sec(r[di])))

    corse, coll = [], []
    for t, righe in per_corsa.items():
        righe.sort()
        k = len(corse)
        corse.append(corsa_linea[t])
        for (_, s1, _, d1), (_, s2, a2, _) in zip(righe, righe[1:]):
            if a2 >= d1 and s1 != s2:
                coll.append((d1, a2, s1, s2, k))
    coll.sort()

    # Tracciati di metro e tram: per ogni linea la forma con più fermate
    forme_scelte = {}
    for t, n in n_fermate_corsa.items():
        li = corsa_linea[t]
        if linee[li][1] in ("0", "1") and n > forme_scelte.get(li, (0, None))[0]:
            forme_scelte[li] = (n, corsa_forma[t])
    vuole = {f: li for li, (_, f) in forme_scelte.items()}
    punti = defaultdict(list)
    with open(g / "shapes.txt", encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        h = next(rd)
        fi, lai, loi, qi = (h.index(c) for c in ("shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"))
        for r in rd:
            if r[fi] in vuole:
                punti[r[fi]].append((int(r[qi]), float(r[lai]), float(r[loi])))
    tracciati = []
    for f, li in vuole.items():
        pts = [(la, lo) for _, la, lo in sorted(punti[f])]
        if len(pts) > 1:
            tracciati.append({"l": nome_linea(*linee[li]), "t": "metro" if linee[li][1] == "1" else "tram",
                              "p": codifica(semplifica(pts, 4e-5))})
    tracciati.sort(key=lambda x: (x["t"], x["l"]))
    return data, linee, fermate, linee_fermata, corse, coll, tracciati


class Griglia:
    """Fermate in celle da circa 300 m, per trovare in fretta quelle vicine a un punto."""

    def __init__(self, fermate):
        self.f = fermate
        self.c = defaultdict(list)
        for i, (_, la, lo) in enumerate(fermate):
            self.c[self._k(la, lo)].append(i)

    @staticmethod
    def _k(la, lo):
        return (int(la / 0.0027), int(lo / 0.0036))

    def vicine(self, la, lo, raggio):
        ky, kx = self._k(la, lo)
        n = int(raggio / 300) + 1
        out = []
        for y in range(ky - n, ky + n + 1):
            for x in range(kx - n, kx + n + 1):
                for i in self.c.get((y, x), ()):
                    d = metri(la, lo, self.f[i][1], self.f[i][2])
                    if d <= raggio:
                        out.append((d, i))
        return sorted(out)


def viaggio(t0, accesso, coll, partenze_coll, corse, cambi, n_fermate):
    """Connection Scan: primo arrivo a ogni fermata partendo alle t0. Ritorna (arrivi, genitori)."""
    arr = [INF] * n_fermate
    gen = [None] * n_fermate
    for d, s in accesso:
        t = t0 + round(d / V_PIEDI)
        if t < arr[s]:
            arr[s], gen[s] = t, ("p", None, round(d / V_PIEDI))
    salita = {}
    fine = t0 + ORIZZONTE
    for i in range(bisect.bisect_left(partenze_coll, t0), len(coll)):
        dep, a, s1, s2, k = coll[i]
        if dep > fine:
            break
        if k not in salita:
            g = gen[s1]
            # Chi arriva a piedi sale subito; chi scende da un mezzo aspetta il tempo di cambio
            pronto = arr[s1] + (T_CAMBIO if g and g[0] == "m" else 0)
            if pronto > dep:
                continue
            salita[k] = s1
        if a < arr[s2]:
            arr[s2], gen[s2] = a, ("m", salita[k], k)
            for w, s3 in cambi[s2]:
                if a + w < arr[s3]:
                    arr[s3], gen[s3] = a + w, ("c", s2, w)
    return arr, gen


def tappe(s, gen, corse, linee, piedi_fine):
    """Ricostruisce il percorso fino alla fermata s: linee usate e secondi a piedi."""
    usate, piedi = [], piedi_fine
    while s is not None and gen[s] is not None:
        tipo, da, x = gen[s]
        if tipo == "m":
            nome = nome_linea(*linee[corse[x]])
            if not usate or usate[-1] != nome:
                usate.append(nome)
            s = da
        elif tipo == "c":
            piedi += x
            s = da
        else:
            piedi += x
            s = None
    return usate[::-1], piedi


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    g = Path(sys.argv[1])
    data, linee, fermate, linee_fermata, corse, coll, tracciati = carica(g, sys.argv[2] if len(sys.argv) > 2 else "")
    print(f"giorno {data}: {len(corse)} corse e {len(coll)} collegamenti nella finestra, {len(fermate)} fermate")
    gr = Griglia(fermate)
    cambi = [[(round(d / V_PIEDI) + T_CAMBIO, j) for d, j in gr.vicine(la, lo, R_CAMBIO) if j != i]
             for i, (_, la, lo) in enumerate(fermate)]
    partenze_coll = [c[0] for c in coll]
    mete = list(SEDI) + [(id_quartiere(n), "Quartieri", n, la, lo) for n, _, la, lo in QUARTIERI]
    uscite = [[(round(d / V_PIEDI), s) for d, s in gr.vicine(la, lo, R_ACCESSO)] for _, _, _, la, lo in mete]

    zone = []
    for nome, area, qla, qlo in QUARTIERI:
        accesso = gr.vicine(qla, qlo, R_ACCESSO)
        prove = [viaggio(t0, accesso, coll, partenze_coll, corse, cambi, len(fermate)) for t0 in PARTENZE]
        tempi = []
        for j, (_, _, _, sla, slo) in enumerate(mete):
            a_piedi = round(metri(qla, qlo, sla, slo) / V_PIEDI)
            if a_piedi < 120:        # la meta è questo stesso quartiere
                tempi.append({"m": 0, "l": [], "p": 0})
                continue
            esiti = []
            for t0, (arr, gen) in zip(PARTENZE, prove):
                w, s = min(((arr[s] + w, s) for w, s in uscite[j]), default=(INF, None))
                esiti.append((w - t0, s, gen) if s is not None and w < INF else (INF, None, gen))
            esiti.sort(key=lambda e: e[0])
            durata, s, gen = esiti[len(esiti) // 2]
            if a_piedi <= durata:
                tempi.append({"m": max(1, round(a_piedi / 60)), "l": [], "p": max(1, round(a_piedi / 60))})
            elif durata >= INF:
                tempi.append(None)
            else:
                fine = next(w for w, x in uscite[j] if x == s)
                usate, piedi = tappe(s, gen, corse, linee, fine)
                tempi.append({"m": round(durata / 60), "l": usate, "p": round(piedi / 60)})

        # Mezzi vicini: metro entro 1 km, tram entro 600 m, bus entro 400 m (in linea d'aria)
        metro = {}
        tram, bus, notte = set(), set(), set()
        for d, s in accesso:
            for li in linee_fermata.get(s, ()):
                sigla, tipo = linee[li]
                if tipo == "1":
                    n = nome_linea(sigla, tipo)
                    if n not in metro:
                        metro[n] = {"l": n, "f": nome_fermata(fermate[s][0]), "m": max(1, round(d / V_PIEDI / 60))}
                elif tipo == "0" and d <= 600:
                    tram.add(sigla)
                elif tipo == "3" and d <= 400:
                    (notte if sigla.lower().startswith("n") else bus).add(sigla)
        zone.append({"id": id_quartiere(nome), "n": nome, "a": area, "la": qla, "lo": qlo, "t": tempi,
                     "metro": sorted(metro.values(), key=lambda x: x["m"]),
                     "tram": sorted(tram, key=lambda x: (len(x), x)), "bus": len(bus), "notte": len(notte)})
        print(f"  {nome}: " + ", ".join("—" if t is None else str(t["m"]) for t in tempi[:len(SEDI)]))

    dati = {
        "meta": {"giorno": data, "partenze": "7:50–8:50", "fonte": "Roma Servizi per la Mobilità, GTFS statico (CC BY 3.0 IT)",
                 "generato": datetime.date.today().isoformat()},
        "sedi": [{"id": sid, "g": gr_, "n": n, "la": la, "lo": lo} for sid, gr_, n, la, lo in mete],
        "zone": zone,
        "linee": tracciati,
    }
    out = ROOT / "dati" / "zone.js"
    out.parent.mkdir(exist_ok=True)
    out.write_text("// Generato da strumenti/tempi_mezzi.py: non modificare a mano.\n"
                   "// Orari e tracciati: Roma Servizi per la Mobilità, GTFS statico, licenza CC BY 3.0 IT.\n"
                   "window.ZG = " + json.dumps(dati, ensure_ascii=False, separators=(",", ":")) + ";\n", "utf-8")
    print(f"{out.relative_to(ROOT)}: {out.stat().st_size // 1024} KB, {len(tracciati)} tracciati")


if __name__ == "__main__":
    main()
