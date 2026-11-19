#!/usr/bin/env python3
"""Costruisce la pagina unica dell'anteprima online (il link da condividere per la convalida).

Riunisce in un solo file la pagina principale, la privacy e le note legali, con stile, immagini e
carattere incorporati, e aggiunge in alto la fascia «Bozza per convalida».

Uso, dalla cartella premio-adriano:

    python3 strumenti/anteprima-online.py . anteprima.html --completa-da pubblicata.html --senza-loghi

--completa-da FILE   I relatori e l'email di contatto non sono nel repository, che è pubblico.
                     Con questa opzione vengono ripresi dalla pagina già pubblicata (FILE è il suo HTML).
                     Senza l'opzione restano i segnaposto gialli.
--senza-loghi        Nasconde lo spazio dei loghi nella sezione partner. Da usare finché i loghi
                     non ci sono tutti, per non mostrare riquadri vuoti a chi deve convalidare.

Serve solo Python 3, senza altre installazioni.
"""
import argparse
import base64
import os
import re
import sys

MIME = {'.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg'}

STILE_ANTEPRIMA = '''

/* ----------------------------- Solo anteprima online ----------------------------- */
.contenitore {
  padding-left: max(var(--margine), env(safe-area-inset-left, 0px));
  padding-right: max(var(--margine), env(safe-area-inset-right, 0px));
}
.fascia { top: env(safe-area-inset-top, 0px); }
body::before {
  content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px);
  z-index: 60; background: var(--nero);
}
.bozza {
  background: var(--bordeaux); color: var(--bianco);
  font-size: .8125rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  line-height: 1.4; text-align: center; padding-block: 9px;
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.bottone--fermo { cursor: default; }
.bottone--fermo:hover { background: var(--nero); border-color: var(--nero); }
'''

SCRIPT_VISTE = '''
/* Anteprima online: privacy e note legali sono viste della stessa pagina, scelte dall'indirizzo (#privacy, #note-legali). */
(function () {
  'use strict';
  var legali = { 'privacy': 'vista-privacy', 'note-legali': 'vista-note' };
  var tutte = ['vista-sito', 'vista-privacy', 'vista-note'];
  function mostra() {
    var nome = (location.hash || '').replace('#', '');
    var attiva = legali[nome] || 'vista-sito';
    tutte.forEach(function (id) { document.getElementById(id).hidden = (id !== attiva); });
    if (legali[nome]) { window.scrollTo(0, 0); return; }
    var meta = nome ? document.getElementById(nome) : null;
    if (meta) meta.scrollIntoView();
  }
  window.addEventListener('hashchange', mostra);
  mostra();
})();
'''

BOZZA = '<p class="bozza">Bozza per convalida · non pubblicata</p>'


def main():
    ap = argparse.ArgumentParser(description="Costruisce la pagina unica dell'anteprima online.")
    ap.add_argument('sito', help='cartella del sito (quella che contiene index.html)')
    ap.add_argument('uscita', help='file HTML da scrivere')
    ap.add_argument('--completa-da', metavar='FILE', help='HTML della pagina già pubblicata, da cui riprendere relatori ed email')
    ap.add_argument('--senza-loghi', action='store_true', help='nasconde lo spazio dei loghi dei partner')
    a = ap.parse_args()

    def leggi(nome):
        return open(os.path.join(a.sito, nome), encoding='utf-8').read()

    def data_uri(nome, mime):
        with open(os.path.join(a.sito, nome), 'rb') as f:
            return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())

    # ---------- stile, con il carattere incorporato ----------
    css = leggi('css/stile.css')
    css = re.sub(r'url\("\.\./fonts/([^"]+)"\)', lambda m: 'url("%s")' % data_uri('fonts/' + m.group(1), 'font/woff2'), css)
    css += STILE_ANTEPRIMA
    if a.senza_loghi:
        css += '.partner__logo { display: none; }\n'

    # ---------- pagina principale ----------
    idx = leggi('index.html')
    corpo = idx[idx.index('<a class="salta"'):idx.index('<script src="js/app.js"')]

    if a.completa_da:
        pubblicata = open(a.completa_da, encoding='utf-8').read()
        relatori = re.search(r'<ul class="relatori">.*?</ul>', pubblicata, re.S)
        email = re.search(r'<p class="contatti__email">.*?</p>', pubblicata, re.S)
        attesa = re.search(r'<p class="programma__attesa">.*?</p>', corpo, re.S)
        if relatori and attesa:
            corpo = corpo.replace(attesa.group(0), relatori.group(0))
            print('relatori ripresi dalla pagina pubblicata:', relatori.group(0).count('<li>'))
        elif attesa:
            print('ATTENZIONE: relatori non trovati nella pagina pubblicata, resta il segnaposto')
        segnaposto = re.search(r'<p class="contatti__email"><span class="da-inserire">.*?</span></p>', corpo, re.S)
        if email and segnaposto and 'da-inserire' not in email.group(0):
            corpo = corpo.replace(segnaposto.group(0), email.group(0))
            print('email di contatto ripresa dalla pagina pubblicata')
        elif segnaposto:
            print("ATTENZIONE: email di contatto non trovata nella pagina pubblicata, resta il segnaposto")

    # nell'anteprima non si possono scaricare file né contare sui link email
    corpo = re.sub(r'<a class="bottone" href="cerimonia-lancio-2026\.ics" download>(.*?)</a>',
                   r'<span class="bottone bottone--fermo">\1</span>', corpo)
    corpo = re.sub(r'<a class="bottone" href="mailto:[^"]*">Richiedi il dossier</a>',
                   '<a class="bottone" href="#contatti">Richiedi il dossier</a>', corpo)
    corpo = corpo.replace('href="privacy.html"', 'href="#privacy"').replace('href="note-legali.html"', 'href="#note-legali"')

    # ---------- privacy e note legali, come viste della stessa pagina ----------
    def vista_legale(file, altro_href, altro_testo):
        h = leggi(file)
        main_ = h[h.index('<main class="pagina"'):h.index('</main>') + len('</main>')]
        main_ = main_.replace('<main class="pagina" id="contenuto">', '<main class="pagina">')
        main_ = main_.replace('href="index.html"', 'href="#top"')
        return '''
<div class="bordo-alto" aria-hidden="true"></div>
<header class="fascia">
  <div class="contenitore fascia__interno">
    <a class="fascia__marchio" href="#top"><img src="img/titolo-premio-adriano-2026.svg" alt="Premio Adriano 2026, torna alla pagina principale" width="2370" height="173"></a>
    <nav class="fascia__nav fascia__nav--semplice" aria-label="Navigazione"><a href="#top">Torna al sito</a></nav>
  </div>
</header>
%s
<footer class="piede piede--semplice">
  <div class="contenitore">
    <p>Premio Internazionale Adriano – Città di Tivoli · <a href="#top">Torna al sito</a> · <a href="%s">%s</a></p>
  </div>
</footer>''' % (main_, altro_href, altro_testo)

    privacy = vista_legale('privacy.html', '#note-legali', 'Note legali e accessibilità')
    note = vista_legale('note-legali.html', '#privacy', 'Privacy e cookie')

    pagina = '''<title>Premio Internazionale Adriano</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
%s
</style>

<div id="vista-sito">
%s
%s
</div>

<div id="vista-privacy" hidden>
%s
%s
</div>

<div id="vista-note" hidden>
%s
%s
</div>

<script>
%s
%s
</script>
''' % (css, BOZZA, corpo, BOZZA, privacy, BOZZA, note, leggi('js/app.js'), SCRIPT_VISTE)

    # i commenti del codice sono note di lavoro: non vanno nella pagina condivisa
    pagina = re.sub(r'<!--.*?-->\n?', '', pagina, flags=re.S)

    # ---------- immagini incorporate ----------
    def incorpora(m):
        percorso = m.group(1)
        return 'src="%s"' % data_uri(percorso, MIME[os.path.splitext(percorso)[1]])
    pagina = re.sub(r'src="(img/[^"]+)"', incorpora, pagina)

    for vietato in ('<!DOCTYPE', '<html', '<head>', '<body', 'src="img/', 'href="css/', '../fonts/',
                    'http-equiv', 'index.html', 'privacy.html"', 'note-legali.html"'):
        if vietato in pagina:
            sys.exit('ERRORE: nella pagina è rimasto «%s»' % vietato)

    with open(a.uscita, 'w', encoding='utf-8') as f:
        f.write(pagina)
    print('scritto %s (%d KB)' % (a.uscita, len(pagina.encode()) // 1024))


if __name__ == '__main__':
    main()
