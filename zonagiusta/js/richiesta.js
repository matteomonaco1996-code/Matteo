// Zona Giusta — richieste di chi cerca casa: modulo, accesso con codice via email, riepilogo.
// Parla con Supabase solo se config.js contiene indirizzo e chiave pubblica del progetto;
// senza, il modulo si può vedere ma non salva. Le regole vere stanno nel database
// (supabase/schema.sql): qui si raccolgono i dati e si mostrano gli esiti.
(() => {
  "use strict";
  const App = window.ZGApp;
  if (!App) return;
  const C = window.ZG_CONFIG || {};
  const { D, esc } = App;
  const $ = (s) => document.querySelector(s);
  const attivo = !!(C.supabaseUrl && C.supabaseKey && window.supabase);
  const sb = attivo ? window.supabase.createClient(C.supabaseUrl, C.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce", storageKey: "zg-sessione" },
  }) : null;
  const io = { utente: null, richiesta: null };
  const dlg = $("#richiesta"), corpo = $("#richiesta-corpo");

  const TIPI = { stanza_singola: "Stanza singola", stanza_doppia: "Posto in stanza doppia", monolocale: "Monolocale", appartamento: "Appartamento intero" };
  const CHI = { studio: "Studio", lavoro: "Lavoro", studio_lavoro: "Studio e lavoro" };
  const MINUTI = [20, 30, 45, 60];
  const fmtData = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric" });
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const daIso = (s) => new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), 12);

  // La bozza resta nel browser mentre arriva il codice (o se si torna dal link dell'email): vale un'ora.
  const bozza = {
    leggi() {
      try {
        const b = JSON.parse(localStorage.getItem("zg-bozza") || "null");
        return b && Date.now() - b.quando < 3600e3 ? b : null;
      } catch (e) { return null; }
    },
    scrivi(b) {
      try {
        if (b) localStorage.setItem("zg-bozza", JSON.stringify({ ...b, quando: Date.now() }));
        else localStorage.removeItem("zg-bozza");
      } catch (e) { /* senza memoria del browser si continua lo stesso */ }
    },
  };

  function errore(e) {
    const m = (e && e.message) || "";
    if (/rate limit|too many|429/i.test(m)) return "Troppi tentativi in poco tempo. Riprova tra qualche minuto.";
    if (/fetch|network/i.test(m)) return "Non riesco a raggiungere il servizio. Controlla la connessione e riprova.";
    if (/18 anni/.test(m)) return "Per lasciare una richiesta devi avere almeno 18 anni.";
    if (/Quartieri non validi|Data di inizio non valida/.test(m)) return m + ".";
    return "Qualcosa non ha funzionato. Riprova tra poco.";
  }
  const mostra = (el, testo) => { el.textContent = testo; el.hidden = false; };

  // ---------- Modulo ----------
  function disegnaModulo(v, avviso) {
    v = v || {};
    const oggi = new Date(), limite = new Date(oggi.getTime() + 365 * 864e5);
    const meta = v.meta || D.sedi[App.stato.sede].id;
    const minuti = v.minuti || v.minuti_max || (MINUTI.includes(App.stato.max) ? App.stato.max : 30);
    const gruppi = [...new Set(D.sedi.map((s) => s.g))];
    const scelta = (valori, attuale) => Object.entries(valori).map(([k, t]) => `<option value="${k}"${k === attuale ? " selected" : ""}>${t}</option>`).join("");
    const giaAccettato = io.richiesta ? " checked" : "";
    const spento = attivo ? "" : `<p class="avviso">${C.anteprima ? "Questa è un’anteprima: puoi vedere il modulo, ma il salvataggio è spento." : "Il salvataggio delle richieste non è attivo in questa versione."}</p>`;

    corpo.innerHTML = `${avviso ? `<p class="fatto">${esc(avviso)}</p>` : ""}${spento}
      <form class="modulo" id="f-richiesta">
        <div class="voce"><label for="f-meta">Dove devi arrivare ogni mattina</label>
          <select id="f-meta">${gruppi.map((g) => `<optgroup label="${esc(g)}">` + D.sedi.map((s) => (s.g === g ? `<option value="${s.id}"${s.id === meta ? " selected" : ""}>${esc(s.n)}</option>` : "")).join("") + "</optgroup>").join("")}</select></div>
        <div class="voce"><label for="f-minuti">Tempo massimo di viaggio</label>
          <select id="f-minuti">${MINUTI.map((m) => `<option value="${m}"${m === minuti ? " selected" : ""}>${m} minuti</option>`).join("")}</select></div>
        <fieldset class="voce"><legend>In quali quartieri vivresti</legend>
          <p class="aiuto" id="f-zone-nota"></p>
          <div class="chips zone-chips" id="f-zone"></div></fieldset>
        <div class="voce"><label for="f-budget">Quanto puoi spendere al mese, spese comprese</label>
          <div class="con-unita"><input type="number" id="f-budget" min="200" max="3000" step="10" required inputmode="numeric" value="${v.budget || ""}"><span>€</span></div></div>
        <div class="voce"><label for="f-tipo">Cosa cerchi</label><select id="f-tipo">${scelta(TIPI, v.tipo || "stanza_singola")}</select></div>
        <div class="voce"><label for="f-da">Da quando</label>
          <input type="date" id="f-da" required min="${iso(oggi)}" max="${iso(limite)}" value="${v.da_quando && v.da_quando >= iso(oggi) ? v.da_quando : ""}"></div>
        <div class="voce"><label for="f-chi">Sei a Roma per</label>
          <select id="f-chi" required><option value="">Scegli</option>${scelta(CHI, v.chi || "")}</select></div>
        <label class="spunta"><input type="checkbox" id="f-eta" required${giaAccettato}><span>Ho almeno 18 anni.</span></label>
        <label class="spunta"><input type="checkbox" id="f-termini" required${giaAccettato}><span>Accetto i <a href="termini.html" target="_blank" rel="noopener">termini d’uso</a> e ho letto l’<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a>.</span></label>
        <p class="aiuto">Non chiediamo nome, telefono o reddito. Oggi la tua richiesta non è visibile ad altri utenti: in pubblico escono solo i numeri per quartiere.</p>
        <p class="errore" id="f-err" hidden></p>
        <div class="azioni"><button class="btn" type="submit">${io.richiesta ? "Salva le modifiche" : io.utente ? "Salva la richiesta" : "Continua"}</button>
          ${io.richiesta ? '<button class="btn alt" type="button" id="f-annulla">Annulla</button>' : ""}</div>
      </form>`;

    function disegnaZone(scelte) {
      const j = D.sedi.findIndex((s) => s.id === $("#f-meta").value);
      const max = +$("#f-minuti").value;
      const righe = D.zone.map((z) => ({ z, t: z.t[j] })).filter((x) => x.t).sort((a, b) => a.t.m - b.t.m || a.z.n.localeCompare(b.z.n, "it"));
      $("#f-zone").innerHTML = righe.map(({ z, t }) => {
        const si = scelte ? scelte.includes(z.id) : t.m <= max;
        return `<label><input type="checkbox" id="z-${z.id}" value="${z.id}"${si ? " checked" : ""}><span>${esc(z.n)} <small>${t.m ? t.m + "′" : "qui"}</small></span></label>`;
      }).join("");
      contaZone();
    }
    function contaZone() {
      const n = corpo.querySelectorAll("#f-zone input:checked").length;
      $("#f-zone-nota").textContent = n
        ? `${App.plurale(n, "quartiere scelto", "quartieri scelti")}, con i minuti di viaggio. Togli quelli dove non vivresti.`
        : "Scegli almeno un quartiere.";
    }
    disegnaZone(Array.isArray(v.zone) ? v.zone : null);
    $("#f-meta").addEventListener("change", () => disegnaZone(null));
    $("#f-minuti").addEventListener("change", () => disegnaZone(null));
    $("#f-zone").addEventListener("change", contaZone);
    if (io.richiesta) $("#f-annulla").addEventListener("click", () => disegnaRiepilogo());

    $("#f-richiesta").addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = $("#f-err");
      err.hidden = true;
      const zone = [...corpo.querySelectorAll("#f-zone input:checked")].map((c) => c.value);
      if (!zone.length) return mostra(err, "Scegli almeno un quartiere.");
      if (!attivo) return mostra(err, C.anteprima ? "In questa anteprima il salvataggio è spento: funzionerà sul sito pubblicato." : "Il salvataggio delle richieste non è attivo in questa versione.");
      const b = { meta: $("#f-meta").value, minuti: +$("#f-minuti").value, zone, budget: +$("#f-budget").value, tipo: $("#f-tipo").value,
        da_quando: $("#f-da").value, chi: $("#f-chi").value, maggiorenne: $("#f-eta").checked };
      bozza.scrivi(b);
      if (!io.utente) return disegnaEmail();
      const bottone = e.submitter;
      if (bottone) bottone.disabled = true;
      const esito = await salva(b);
      if (bottone) bottone.disabled = false;
      if (esito) mostra(err, esito);
    });
  }

  // Salva sul database. Ritorna il messaggio d'errore, o "" se è andata bene.
  async function salva(b) {
    const { error } = await sb.rpc("salva_richiesta", {
      p_meta: b.meta, p_minuti: b.minuti, p_zone: b.zone, p_budget: b.budget, p_tipo: b.tipo, p_da_quando: b.da_quando,
      p_chi: b.chi, p_maggiorenne: b.maggiorenne === true, p_termini: C.versioneTermini || "1.0", p_privacy: C.versionePrivacy || "1.0",
    });
    if (error) return errore(error);
    bozza.scrivi(null);
    await caricaRichiesta();
    caricaNumeri();
    aggiornaBottone();
    disegnaRiepilogo("Richiesta salvata.");
    return "";
  }

  // ---------- Accesso con codice via email ----------
  function disegnaEmail(email = "") {
    corpo.innerHTML = `<p>Per salvare la richiesta ci serve la tua email: ti mandiamo un codice, niente password.</p>
      <form class="modulo" id="f-email">
        <div class="voce"><label for="a-email">Email</label><input type="email" id="a-email" required autocomplete="email" value="${esc(email)}"></div>
        <p class="aiuto">La usiamo per farti accedere e per scriverti della tua richiesta. Niente pubblicità.</p>
        <p class="errore" id="a-err" hidden></p>
        <div class="azioni"><button class="btn" type="submit">Mandami il codice</button><button class="btn alt" type="button" id="a-indietro">Torna al modulo</button></div>
      </form>`;
    $("#a-indietro").addEventListener("click", () => disegnaModulo(bozza.leggi()));
    $("#f-email").addEventListener("submit", async (e) => {
      e.preventDefault();
      const em = $("#a-email").value.trim();
      const bottone = e.submitter;
      if (bottone) bottone.disabled = true;
      const { error } = await sb.auth.signInWithOtp({ email: em, options: { shouldCreateUser: true, emailRedirectTo: location.href.split("#")[0].split("?")[0] } });
      if (bottone) bottone.disabled = false;
      if (error) return mostra($("#a-err"), errore(error));
      disegnaCodice(em);
    });
  }
  function disegnaCodice(email) {
    corpo.innerHTML = `<p>Ti abbiamo scritto a <b>${esc(email)}</b>. Inserisci il codice dell’email, oppure apri il link che contiene.</p>
      <form class="modulo" id="f-codice">
        <div class="voce"><label for="a-codice">Codice</label><input type="text" id="a-codice" required inputmode="numeric" autocomplete="one-time-code" maxlength="10"></div>
        <p class="errore" id="c-err" hidden></p>
        <div class="azioni"><button class="btn" type="submit">Entra e salva</button><button class="btn alt" type="button" id="c-indietro">Cambia email</button></div>
      </form>`;
    $("#c-indietro").addEventListener("click", () => disegnaEmail(email));
    $("#f-codice").addEventListener("submit", async (e) => {
      e.preventDefault();
      const { error } = await sb.auth.verifyOtp({ email, token: $("#a-codice").value.trim(), type: "email" });
      if (error) return mostra($("#c-err"), "Codice non valido o scaduto.");
      corpo.innerHTML = "<p>Accesso riuscito, salvo la richiesta…</p>";   // il resto lo fa dopoAccesso()
    });
  }

  // ---------- Riepilogo ----------
  function disegnaRiepilogo(avviso) {
    const r = io.richiesta;
    if (!r) return disegnaModulo(bozza.leggi(), avviso);
    const meta = D.sedi.find((s) => s.id === r.meta);
    const nomi = r.zone.map((id) => (D.zone.find((z) => z.id === id) || {}).n).filter(Boolean);
    const scade = new Date(new Date(r.aggiornata).getTime() + 90 * 864e5);
    corpo.innerHTML = `${avviso ? `<p class="fatto">${esc(avviso)}</p>` : ""}
      <dl class="riepilogo">
        <div><dt>Dove devi arrivare</dt><dd>${esc(meta ? meta.n : r.meta)}, entro ${r.minuti_max} minuti</dd></div>
        <div><dt>Quartieri</dt><dd>${esc(nomi.join(", "))}</dd></div>
        <div><dt>Budget</dt><dd>${r.budget} € al mese, spese comprese</dd></div>
        <div><dt>Cosa cerchi</dt><dd>${TIPI[r.tipo] || esc(r.tipo)}, dal ${fmtData.format(daIso(r.da_quando))}</dd></div>
      </dl>
      <p class="aiuto">Vale fino al ${fmtData.format(scade)}: salvala di nuovo per rinnovarla. Oggi non è visibile ad altri utenti. Quando apriremo le proposte di affitto ti avviseremo a ${esc(io.utente.email || "")}.</p>
      <div class="azioni"><button class="btn" type="button" id="r-modifica">Modifica</button><button class="btn alt" type="button" id="r-esporta">Esporta i miei dati</button><button class="btn alt" type="button" id="r-esci">Esci</button></div>
      <div id="r-extra"></div>
      <p><button class="pericolo" type="button" id="r-elimina">Elimina richiesta e account</button></p>`;
    $("#r-modifica").addEventListener("click", () => disegnaModulo(r));
    $("#r-esci").addEventListener("click", async () => { await sb.auth.signOut(); dlg.close(); });
    $("#r-esporta").addEventListener("click", async () => {
      const { data, error } = await sb.rpc("esporta_dati");
      $("#r-extra").innerHTML = error ? `<p class="errore">${esc(errore(error))}</p>`
        : `<p class="aiuto">Tutti i dati che abbiamo su di te. Puoi selezionarli e copiarli.</p><pre class="dati" tabindex="0">${esc(JSON.stringify(data, null, 2))}</pre>`;
    });
    $("#r-elimina").addEventListener("click", () => {
      $("#r-extra").innerHTML = `<p><b>Sicuro?</b> Cancelliamo subito email e richiesta. Non si può annullare.</p>
        <div class="azioni"><button class="btn pericolo-pieno" type="button" id="r-elimina-si">Sì, elimina tutto</button><button class="btn alt" type="button" id="r-elimina-no">Annulla</button></div>
        <p class="errore" id="r-err" hidden></p>`;
      $("#r-elimina-no").addEventListener("click", () => { $("#r-extra").innerHTML = ""; });
      $("#r-elimina-si").addEventListener("click", async () => {
        const { error } = await sb.rpc("elimina_account");
        if (error) return mostra($("#r-err"), errore(error));
        eliminato = true;
        await sb.auth.signOut();
      });
    });
  }

  // ---------- Stato ----------
  let eliminato = false;
  const aggiornaBottone = () => { $("#apri-richiesta").textContent = io.richiesta ? "La tua richiesta" : "Lascia la tua richiesta"; };

  async function caricaRichiesta() {
    const { data } = await sb.from("richieste").select("*").maybeSingle();
    io.richiesta = data || null;
  }
  async function caricaNumeri() {
    const { data, error } = await sb.rpc("richieste_per_zona");
    if (error || !data) return;
    const zone = {};
    (data.zone || []).forEach((x) => { zone[x.zona] = x; });
    App.numeri = { totale: data.totale || 0, zone };
    const c = $("#conta-richieste");
    c.hidden = !App.numeri.totale;
    c.textContent = App.numeri.totale ? `${App.plurale(App.numeri.totale, "richiesta attiva", "richieste attive")} finora.` : "";
    App.ridisegna();
  }

  // Dopo un accesso o un'uscita: ricarica lo stato e, se c'è una bozza in attesa, la salva.
  let coda = Promise.resolve();
  function dopoAccesso(session) {
    coda = coda.then(async () => {
      io.utente = session ? session.user : null;
      io.richiesta = null;
      let avviso = "", problema = "";
      if (io.utente) {
        await caricaRichiesta();
        const b = bozza.leggi();
        if (b) {
          problema = await salva(b);             // se va bene mostra da sé il riepilogo
          if (!problema) { if (!dlg.open) dlg.showModal(); return; }
        }
      } else if (eliminato) {
        eliminato = false;
        avviso = "Account e richiesta eliminati.";
        caricaNumeri();
      }
      aggiornaBottone();
      if (problema) {                            // la bozza non è passata: si torna al modulo con il motivo
        if (!dlg.open) dlg.showModal();
        disegnaModulo(bozza.leggi() || io.richiesta);
        mostra($("#f-err"), problema);
      } else if (dlg.open) {
        if (io.richiesta) disegnaRiepilogo(avviso); else disegnaModulo(bozza.leggi(), avviso);
      }
    }).catch(() => { /* un errore qui non deve bloccare la pagina */ });
  }

  // ---------- Avvio ----------
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-richiesta]")) return;
    if (io.richiesta) disegnaRiepilogo(); else disegnaModulo(bozza.leggi());
    if (!dlg.open) dlg.showModal();
  });
  $("#richiesta-chiudi").addEventListener("click", () => dlg.close());

  if (attivo) {
    sb.auth.onAuthStateChange((evento, session) => {
      // Supabase ripete SIGNED_IN quando la scheda torna in primo piano: se la persona è la stessa
      // non si tocca nulla, altrimenti si perderebbe il modulo che sta compilando.
      const id = session ? session.user.id : null;
      if (evento !== "INITIAL_SESSION" && id === (io.utente ? io.utente.id : null)) return;
      setTimeout(() => dopoAccesso(session), 0);   // mai lavorare dentro il callback di Supabase
    });
    caricaNumeri();
  }
})();
