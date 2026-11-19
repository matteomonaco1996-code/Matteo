/* Premio Internazionale Adriano – Città di Tivoli
   Tre piccole cose: menu su telefono, comparsa delle sezioni, copia dell'indirizzo email.
   La pagina funziona anche senza JavaScript. */
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

  // --- Comparsa delle sezioni allo scorrimento ---
  var blocchi = document.querySelectorAll('[data-entra]');
  var fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fermo || !('IntersectionObserver' in window)) {
    blocchi.forEach(function (b) { b.classList.add('visto'); });
  } else {
    var osserva = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (v.isIntersecting) {
          v.target.classList.add('visto');
          osserva.unobserve(v.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    blocchi.forEach(function (b) { osserva.observe(b); });
  }

  // --- Copia dell'indirizzo email (per chi non ha un programma di posta configurato) ---
  document.querySelectorAll('[data-copia]').forEach(function (b) {
    var testo = b.textContent;
    b.addEventListener('click', function () {
      var valore = b.getAttribute('data-copia');
      var fatto = function () {
        b.textContent = 'Copiato';
        setTimeout(function () { b.textContent = testo; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(valore).then(fatto, function () {});
      }
    });
  });
})();
