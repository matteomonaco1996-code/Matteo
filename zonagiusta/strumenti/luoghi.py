"""Quartieri e destinazioni (università, stazioni, ospedali, uffici) di Zona Giusta.

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

# Destinazioni: dove si studia o si lavora. Le coordinate di stazioni, ospedali e uffici sono
# quelle delle fermate ufficiali con lo stesso nome nel GTFS.
SEDI = [
    # id, gruppo, nome, lat, lon
    ("sapienza", "Università", "Sapienza · Città Universitaria", 41.9034, 12.5146),
    ("sapienza-ingegneria", "Università", "Sapienza · Ingegneria, San Pietro in Vincoli", 41.8938, 12.4929),
    ("sapienza-architettura", "Università", "Sapienza · Architettura, Valle Giulia", 41.9186, 12.4800),
    ("romatre-ostiense", "Università", "Roma Tre · via Ostiense", 41.8630, 12.4792),
    ("romatre-ingegneria", "Università", "Roma Tre · Ingegneria, Vasca Navale", 41.8545, 12.4700),
    ("torvergata", "Università", "Tor Vergata · campus, via Columbia", 41.8535, 12.6225),
    ("luiss-romania", "Università", "Luiss · viale Romania", 41.9243, 12.4933),
    ("luiss-pola", "Università", "Luiss · viale Pola", 41.9172, 12.5143),
    ("lumsa", "Università", "LUMSA · Borgo Sant'Angelo", 41.9032, 12.4635),
    ("cattolica", "Università", "Cattolica · Policlinico Gemelli", 41.9318, 12.4290),
    ("foroitalico", "Università", "Foro Italico · Scienze motorie", 41.9335, 12.4570),
    ("campus-biomedico", "Università", "Campus Bio-Medico · Trigoria", 41.77144, 12.46762),
    ("termini", "Stazioni, ospedali e uffici", "Stazione Termini", 41.90131, 12.50043),
    ("tiburtina", "Stazioni, ospedali e uffici", "Stazione Tiburtina", 41.90983, 12.52814),
    ("ostiense-stazione", "Stazioni, ospedali e uffici", "Stazione Ostiense", 41.87313, 12.48446),
    ("trastevere-stazione", "Stazioni, ospedali e uffici", "Stazione Trastevere", 41.87298, 12.46617),
    ("policlinico", "Stazioni, ospedali e uffici", "Policlinico Umberto I", 41.90909, 12.50740),
    ("san-camillo", "Stazioni, ospedali e uffici", "Ospedale San Camillo", 41.87067, 12.45507),
    ("pertini", "Stazioni, ospedali e uffici", "Ospedale Pertini", 41.91895, 12.53783),
    ("san-filippo-neri", "Stazioni, ospedali e uffici", "Ospedale San Filippo Neri", 41.94637, 12.41599),
    ("sant-andrea", "Stazioni, ospedali e uffici", "Ospedale Sant'Andrea", 41.98131, 12.47082),
    ("saxa-rubra", "Stazioni, ospedali e uffici", "Saxa Rubra · Rai", 41.97736, 12.49339),
    ("porta-di-roma", "Stazioni, ospedali e uffici", "Porta di Roma · Bufalotta", 41.97799, 12.53079),
    ("tecnopolo", "Stazioni, ospedali e uffici", "Tecnopolo Tiburtino", 41.92914, 12.63539),
]
