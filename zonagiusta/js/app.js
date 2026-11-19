// Zona Giusta — classifica dei quartieri per tempo di viaggio verso la sede scelta, con mappa.
// I dati sono generati: dati/zone.js (strumenti/tempi_mezzi.py) e dati/posti.js (strumenti/posti_ristomat.py).
(() => {
  "use strict";
  const D = window.ZG;
  if (!D) return;
  const POSTI = (window.ZG_POSTI && window.ZG_POSTI.q) || {};
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const SOGLIE = [15, 25, 35, 45];
  const fascia = (m) => 1 + SOGLIE.filter((x) => m > x).length;       // 1 = vicino … 5 = lontano
  const stato = { sede: 0, max: 0, aperta: -1 };

  // ---------- Testi ----------
  const classeLinea = (l) => (l === "Metro A" ? "la" : l === "Metro B" ? "lb" : l === "Metro C" ? "lc" : l.startsWith("Tram") ? "lt" : "lbus");
  const badge = (l) => `<span class="linea ${classeLinea(l)}">${esc(l)}</span>`;
  const plurale = (n, uno, tanti) => `${n} ${n === 1 ? uno : tanti}`;

  function come(t) {
    if (!t.l.length) return "tutto a piedi";
    return t.l.map(badge).join("") + `<span>+ ${t.p} min a piedi</span>`;
  }

  function scheda(z, t) {
    const sede = D.sedi[stato.sede].n;
    const viaggio = t.l.length
      ? `${t.m} minuti in tutto, di cui ${t.p} a piedi${t.l.length > 1 ? `, con ${plurale(t.l.length - 1, "cambio", "cambi")}` : ""}.`
      : `${t.m} minuti a piedi, senza prendere mezzi.`;

    const mezzi = [];
    z.metro.forEach((s) => mezzi.push(`<li>${badge(s.l)}<span>${esc(s.f)}, a ${s.m} min a piedi</span></li>`));
    if (z.tram.length) mezzi.push(`<li>${z.tram.map((n) => badge("Tram " + n)).join("")}<span>entro 600 metri</span></li>`);
    mezzi.push(`<li><span>${plurale(z.bus, "linea di bus", "linee di bus")} entro 400 metri${z.notte ? `, più ${plurale(z.notte, "notturna", "notturne")}` : ""}</span></li>`);
    if (!z.metro.length) mezzi.push(`<li class="tenue">Nessuna fermata della metro entro 1 km.</li>`);

    const p = POSTI[z.n];
    const posti = p
      ? `<p>${plurale(p.n, "posto consigliato", "posti consigliati")} su <a href="https://ristomat.click" target="_blank" rel="noopener">RistoMat</a>${p.tipi.length ? ": " + p.tipi.map(([e, n]) => `${n} ${esc(e)}`).join(", ") : ""}.</p>`
      : `<p class="tenue">Nessun posto su RistoMat, per ora.</p>`;

    return `<div><h3>Per arrivare a ${esc(sede)}</h3><p>${viaggio}</p></div>
      <div><h3>Mezzi sotto casa</h3><ul>${mezzi.join("")}</ul></div>
      <div><h3>Dove mangiare e bere</h3>${posti}</div>
      <div><h3>Stanze</h3><p class="tenue">Prezzi e annunci non ci sono ancora: è il prossimo passo.</p></div>`;
  }

  // ---------- Classifica ----------
  function ordinati() {
    return D.zone
      .map((z, i) => ({ z, i, t: z.t[stato.sede] }))
      .filter((x) => x.t)
      .sort((a, b) => a.t.m - b.t.m || a.z.n.localeCompare(b.z.n, "it"));
  }

  function disegnaLista() {
    const tutti = ordinati();
    const visibili = stato.max ? tutti.filter((x) => x.t.m <= stato.max) : tutti;
    const sede = D.sedi[stato.sede].n;
    $("#t-lista").textContent = stato.max
      ? `${plurale(visibili.length, "quartiere", "quartieri")} entro ${stato.max} minuti da ${sede}`
      : `${visibili.length} quartieri, dal più vicino a ${sede}`;
    $("#vuoto").hidden = visibili.length > 0;
    $("#zone").innerHTML = visibili.map(({ z, i, t }) => {
      const aperta = stato.aperta === i;
      return `<li>
        <button type="button" class="riga" id="r-${i}" data-i="${i}" aria-expanded="${aperta}" aria-controls="s-${i}">
          <span class="min b${fascia(t.m)}"><b>${t.m}</b><small>min</small></span>
          <span class="chi"><span class="nome">${esc(z.n)}</span><span class="come">${come(t)}</span></span>
          <span class="area">${esc(z.a)}</span>
        </button>
        <div class="scheda" id="s-${i}"${aperta ? "" : " hidden"}>${aperta ? scheda(z, t) : ""}</div>
      </li>`;
    }).join("");
  }

  function apri(i, scorri) {
    stato.aperta = stato.aperta === i ? -1 : i;
    disegnaLista();
    mappa.aggiorna();
    if (stato.aperta < 0) return;
    const el = document.getElementById("r-" + i);
    if (!el) return;
    if (scorri) el.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    mappa.vai(i);
  }

  // ---------- Mappa ----------
  const mappa = (() => {
    const m = L.map($("#mappa"), { zoomControl: true, scrollWheelZoom: false, zoomSnap: 0.25, minZoom: 10, maxZoom: 16 });
    m.attributionControl.setPrefix(false).addAttribution("© OpenStreetMap · Roma Mobilità");
    const tela = L.canvas({ padding: 0.4 });
    const dec = (a) => { const o = []; let la = 0, lo = 0; for (let i = 0; i < a.length; i += 2) { la += a[i]; lo += a[i + 1]; o.push([la / 1e5, lo / 1e5]); } return o; };
    const base = { renderer: tela, interactive: false };
    const R = (window.SNS_MAPPA && window.SNS_MAPPA.roma) || { fiumi: [], parchi: [], grandi: [], medie: [] };

    const strati = {
      verde: L.polygon(R.parchi.map(dec), { ...base, stroke: false, fillOpacity: 1 }).addTo(m),
      acqua: L.polyline(R.fiumi.map(dec), { ...base, weight: 5, lineCap: "round" }).addTo(m),
      "strada-2": L.polyline(R.medie.map(dec), { ...base, weight: 1 }).addTo(m),
      strada: L.polyline(R.grandi.map(dec), { ...base, weight: 1.6 }).addTo(m),
    };
    const linee = D.linee.map((l) => {
      const metro = l.t === "metro";
      const chiave = l.l === "Metro A" ? "ma" : l.l === "Metro B" ? "mb" : l.l === "Metro C" ? "mc" : "ink";
      return { chiave, strato: L.polyline(dec(l.p), { ...base, weight: metro ? 4.5 : 2, opacity: metro ? 0.95 : 0.55, dashArray: metro ? null : "5 5", lineCap: "round" }).addTo(m) };
    });

    function colori() {
      const css = getComputedStyle(document.documentElement);
      const c = (n) => css.getPropertyValue("--" + n).trim();
      strati.verde.setStyle({ fillColor: c("verde") });
      ["acqua", "strada", "strada-2"].forEach((k) => strati[k].setStyle({ color: c(k) }));
      linee.forEach((l) => l.strato.setStyle({ color: c(l.chiave) }));
    }
    colori();
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colori);
    new MutationObserver(colori).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const icona = (testo, classi) => L.divIcon({ className: "zg-pin", iconSize: [34, 24], iconAnchor: [17, 12], html: `<span class="pin ${classi}">${testo}</span>` });
    const segni = D.zone.map((z, i) => {
      const s = L.marker([z.la, z.lo], { icon: icona("", "b5"), keyboard: false }).addTo(m);
      s.bindTooltip(z.n, { direction: "top", offset: [0, -12] });
      s.on("click", () => apri(i, true));
      return s;
    });
    const segnoSede = L.marker([0, 0], { interactive: true, keyboard: false, zIndexOffset: 500,
      icon: L.divIcon({ className: "zg-sede", iconSize: [18, 18], iconAnchor: [9, 9], html: '<span class="sede"></span>' }) }).addTo(m);

    function aggiorna() {
      D.zone.forEach((z, i) => {
        const t = z.t[stato.sede];
        const classi = [t ? "b" + fascia(t.m) : "b5"];
        if (!t || (stato.max && t.m > stato.max)) classi.push("fuori");
        if (stato.aperta === i) classi.push("sel");
        segni[i].setIcon(icona(t ? t.m : "–", classi.join(" ")));
        segni[i].setZIndexOffset(stato.aperta === i ? 400 : t ? 200 - t.m : 0);
      });
    }
    function inquadra() {
      const s = D.sedi[stato.sede];
      segnoSede.setLatLng([s.la, s.lo]).unbindTooltip().bindTooltip(s.n, { direction: "top", offset: [0, -10] });
      m.fitBounds(L.latLngBounds(D.zone.map((z) => [z.la, z.lo]).concat([[s.la, s.lo]])), { padding: [26, 26] });
    }
    function vai(i) {
      const z = D.zone[i];
      if (!m.getBounds().pad(-0.12).contains([z.la, z.lo])) m.panTo([z.la, z.lo]);
    }
    return { aggiorna, inquadra, vai };
  })();

  // ---------- Comandi ----------
  const sel = $("#sede");
  sel.innerHTML = D.sedi.map((s, i) => `<option value="${i}">${esc(s.n)}</option>`).join("");

  function scegliSede(i, aggiornaIndirizzo) {
    stato.sede = i;
    stato.aperta = -1;
    sel.value = String(i);
    if (aggiornaIndirizzo) { try { history.replaceState(null, "", "#" + D.sedi[i].id); } catch (e) { /* in anteprima può non essere permesso */ } }
    disegnaLista();
    mappa.aggiorna();
    mappa.inquadra();
  }
  const daIndirizzo = () => Math.max(0, D.sedi.findIndex((s) => s.id === location.hash.slice(1)));

  sel.addEventListener("change", () => scegliSede(+sel.value, true));
  $("#massimo").addEventListener("change", (e) => { stato.max = +e.target.value; stato.aperta = -1; disegnaLista(); mappa.aggiorna(); });
  $("#scelta").addEventListener("submit", (e) => e.preventDefault());
  $("#zone").addEventListener("click", (e) => { const b = e.target.closest(".riga"); if (b) apri(+b.dataset.i, false); });
  addEventListener("hashchange", () => scegliSede(daIndirizzo(), false));

  // ---------- Avvio ----------
  const g = D.meta.giorno;
  $("#giorno").textContent = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(+g.slice(0, 4), +g.slice(4, 6) - 1, +g.slice(6, 8), 12));
  const scelto = document.querySelector('#massimo input:checked');
  stato.max = scelto ? +scelto.value : 0;
  scegliSede(daIndirizzo(), false);
})();
