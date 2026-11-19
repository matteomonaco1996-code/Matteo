#!/usr/bin/env python3
"""Genera supabase/luoghi.sql: le destinazioni e i quartieri che il database accetta nelle richieste.

Uso:
    python3 strumenti/luoghi_sql.py

Da rilanciare (e rieseguire su Supabase) ogni volta che cambia strumenti/luoghi.py.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "strumenti"))
from luoghi import QUARTIERI, SEDI  # noqa: E402
from tempi_mezzi import id_quartiere  # noqa: E402


def sql(t):
    return "'" + t.replace("'", "''") + "'"


def main():
    righe = [(sid, nome, False) for sid, _, nome, _, _ in SEDI]
    righe += [(id_quartiere(nome), nome, True) for nome, _, _, _ in QUARTIERI]
    valori = ",\n".join(f"  ({sql(i)}, {sql(n)}, {'true' if q else 'false'})" for i, n, q in righe)
    out = ROOT / "supabase" / "luoghi.sql"
    out.parent.mkdir(exist_ok=True)
    out.write_text("-- Generato da strumenti/luoghi_sql.py: non modificare a mano.\n"
                   "insert into public.mete (id, nome, quartiere) values\n" + valori + "\n"
                   "on conflict (id) do update set nome = excluded.nome, quartiere = excluded.quartiere;\n", "utf-8")
    print(f"{out.relative_to(ROOT)}: {len(righe)} mete, {sum(1 for r in righe if r[2])} quartieri")


if __name__ == "__main__":
    main()
