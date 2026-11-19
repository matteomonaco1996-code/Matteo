/* Premio Internazionale Adriano – Città di Tivoli
   Due sole funzioni: menu su telefono e copia dell'indirizzo email.
   La pagina funziona anche senza JavaScript. Nessun cookie, nessun dato salvato sul dispositivo. */
(function () {
  'use strict';

  // --- Menu su schermi piccoli ---
  var pulsante = document.querySelector('.fascia__menu');
  var menu = document.getElementById('menu');
  if (pulsante && menu) {
    var chiudi = function () {
      pulsante.setAttribute('aria-expanded', 'false');
      menu.classList.remove('aperto');
    };
    pulsante.addEventListener('click', function () {
      var aperto = pulsante.getAttribute('aria-expanded') === 'true';
      pulsante.setAttribute('aria-expanded', String(!aperto));
      menu.classList.toggle('aperto', !aperto);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) chiudi();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') chiudi();
    });
  }

  // --- Copia dell'indirizzo email (per chi non ha un programma di posta configurato) ---
  document.querySelectorAll('[data-copia]').forEach(function (b) {
    var testo = b.textContent;
    b.addEventListener('click', function () {
      if (!navigator.clipboard || !navigator.clipboard.writeText) return;
      navigator.clipboard.writeText(b.getAttribute('data-copia')).then(function () {
        b.textContent = 'Copiato';
        setTimeout(function () { b.textContent = testo; }, 1800);
      }, function () {});
    });
  });
})();
