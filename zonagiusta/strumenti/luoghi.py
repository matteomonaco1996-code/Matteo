"""Quartieri e sedi universitarie di Zona Giusta.

I quartieri sono gli stessi di RistoMat (ristomat/strumenti/quartieri.py): nome, area e un
punto centrale approssimato. Le sedi hanno un punto indicativo, controllato sui nomi delle
fermate vicine nel GTFS (es. "Università La Sapienza", "Vasca Navale/Università", "Romania").
"""

QUARTIERI = [
    # nome, area, lat, lon
    ("Navona · Campo de' Fiori", "Centro", 41.8962, 12.4718),
    ("Pantheon", "Centro", 41.8990, 12.4768),
    ("Ghetto", "Centro", 41.8925, 12.4785),
    ("Spagna · Popolo", "Centro", 41.9068, 12.4790),
    ("Trevi · Barberini", "Centro", 41.9015, 12.4850),
    ("Monti", "Centro", 41.8950, 12.4920),
    ("Esquilino", "Centro", 41.8948, 12.5040),
    ("San Lorenzo", "Centro", 41.8975, 12.5160),
    ("Celio · Colosseo", "Centro", 41.8865, 12.4960),
    ("Aventino · San Saba", "Centro", 41.8810, 12.4855),
    ("Testaccio", "Centro", 41.8768, 12.4755),
    ("Trastevere", "Sponda ovest", 41.8890, 12.4700),
    ("Monteverde", "Sponda ovest", 41.8800, 12.4600),
    ("Marconi · Portuense", "Sponda ovest", 41.8590, 12.4640),
    ("Magliana", "Sponda ovest", 41.8420, 12.4420),
    ("Borgo · San Pietro", "Sponda ovest", 41.9025, 12.4605),
    ("Prati", "Sponda ovest", 41.9085, 12.4625),
    ("Mazzini · Delle Vittorie", "Sponda ovest", 41.9175, 12.4610),
    ("Trionfale", "Sponda ovest", 41.9100, 12.4480),
    ("Aurelio", "Sponda ovest", 41.8990, 12.4420),
    ("Flaminio", "Nord", 41.9245, 12.4720),
    ("Ponte Milvio", "Nord", 41.9370, 12.4670),
    ("Parioli", "Nord", 41.9225, 12.4935),
    ("Salario · Trieste", "Nord", 41.9160, 12.5085),
    ("Castro Pretorio · Porta Pia", "Nord", 41.9060, 12.5020),
    ("Nomentano · Bologna", "Nord", 41.9130, 12.5210),
    ("Montesacro · Talenti", "Nord", 41.9440, 12.5330),
    ("Pigneto", "Est", 41.8880, 12.5310),
    ("Torpignattara", "Est", 41.8790, 12.5380),
    ("Centocelle", "Est", 41.8780, 12.5600),
    ("Tiburtino · Casal Bertone", "Est", 41.9010, 12.5320),
    ("San Giovanni · Re di Roma", "Sud", 41.8805, 12.5125),
    ("Appio Latino · Tuscolano", "Sud", 41.8690, 12.5230),
    ("Quadraro · Cinecittà", "Sud", 41.8550, 12.5470),
    ("Ostiense", "Sud", 41.8710, 12.4815),
    ("Garbatella", "Sud", 41.8620, 12.4885),
    ("EUR", "Sud", 41.8330, 12.4700),
]

SEDI = [
    # id, nome, lat, lon
    ("sapienza", "Sapienza · Città Universitaria", 41.9034, 12.5146),
    ("sapienza-ingegneria", "Sapienza · Ingegneria, San Pietro in Vincoli", 41.8938, 12.4929),
    ("sapienza-architettura", "Sapienza · Architettura, Valle Giulia", 41.9186, 12.4800),
    ("romatre-ostiense", "Roma Tre · via Ostiense", 41.8630, 12.4792),
    ("romatre-ingegneria", "Roma Tre · Ingegneria, Vasca Navale", 41.8545, 12.4700),
    ("torvergata", "Tor Vergata · campus, via Columbia", 41.8535, 12.6225),
    ("luiss-romania", "Luiss · viale Romania", 41.9243, 12.4933),
    ("luiss-pola", "Luiss · viale Pola", 41.9172, 12.5143),
    ("lumsa", "LUMSA · Borgo Sant'Angelo", 41.9032, 12.4635),
    ("cattolica", "Cattolica · Policlinico Gemelli", 41.9318, 12.4290),
    ("foroitalico", "Foro Italico · Scienze motorie", 41.9335, 12.4570),
]
