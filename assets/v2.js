/* Qmala v2 */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = w.matchMedia('(max-width: 759.98px)');
  var yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* hero: wejście nagłówka i wyostrzenie zdjęcia */
  var hero = d.querySelector('.hero'), heroImg = d.querySelector('.hero-img');
  function heroIn() {
    hero.classList.add('ready');
    hero.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); });
  }
  if (heroImg && !heroImg.complete) { heroImg.addEventListener('load', heroIn, { once: true }); setTimeout(heroIn, 1200); }
  else requestAnimationFrame(function () { requestAnimationFrame(heroIn); });

  /* film w hero: tylko gdy ruch dozwolony i łącze nie jest oszczędzane; raz, zatrzymany na ostatniej klatce */
  var vid = d.querySelector('.hero-vid'), conn = navigator.connection || {};
  if (vid && !reduce && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || '')) {
    w.addEventListener('load', function () {
      setTimeout(function () {
        vid.src = vid.dataset.src;
        vid.addEventListener('canplaythrough', function () {
          var p = vid.play(); if (p && p.then) p.then(function () { vid.classList.add('on'); }, function () {});
        }, { once: true });
        vid.load();
      }, 900);
    });
  }

  /* wejścia sekcji przy przewijaniu */
  var rv = [].slice.call(d.querySelectorAll('.rv')).filter(function (n) { return !hero.contains(n); });
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (n) { io.observe(n); });
  } else rv.forEach(function (n) { n.classList.add('in'); });

  /* liczniki */
  function count(el) {
    var to = +el.dataset.count, t0 = 0, dur = 1400;
    if (reduce) return;
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
    el.textContent = '0'; requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in w) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    d.querySelectorAll('[data-count]').forEach(function (n) { co.observe(n); });
  }

  /* nawigacja: tło po przewinięciu, menu mobilne, podświetlenie sekcji */
  var nav = d.getElementById('nav'), dock = d.querySelector('.dock');
  function onScroll() {
    var y = w.scrollY;
    nav.classList.toggle('scrolled', y > 8);
    if (dock) dock.classList.toggle('show', y > w.innerHeight * 0.7 && !nearContact());
  }
  var contactSec = d.getElementById('kontakt');
  function nearContact() { var r = contactSec.getBoundingClientRect(); return r.top < w.innerHeight && r.bottom > 0; }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var tog = d.getElementById('nav-toggle'), links = d.getElementById('nav-links');
  function menu(open) {
    tog.setAttribute('aria-expanded', open); links.classList.toggle('open', open); nav.classList.toggle('menu', open);
  }
  tog.addEventListener('click', function () { menu(tog.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.classList.contains('open')) { menu(false); tog.focus(); } });

  var navA = [].slice.call(links.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in w) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navA.forEach(function (a) { a.classList.toggle('cur', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navA.forEach(function (a) { var s = d.querySelector(a.getAttribute('href')); if (s) so.observe(s); });
  }

  /* jak działamy: zdjęcie zmienia się za wskazanym krokiem; na telefonie miniatura przy każdym kroku */
  var pics = [].slice.call(d.querySelectorAll('.how-pic img')), steps = [].slice.call(d.querySelectorAll('#steps li'));
  var cur = 0;
  function show(i) {
    if (i === cur) return;
    pics.forEach(function (p) { p.classList.remove('was'); });
    pics[cur].classList.remove('on'); pics[cur].classList.add('was');
    pics[i].classList.add('on'); cur = i;
    steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
  }
  steps.forEach(function (s, i) {
    s.addEventListener('mouseenter', function () { show(i); });
    s.addEventListener('focus', function () { show(i); });
    var t = d.createElement('img');
    t.className = 'thumb'; t.alt = ''; t.loading = 'lazy'; t.decoding = 'async'; t.width = 1200; t.height = 896;
    t.src = pics[i].getAttribute('src');
    s.querySelector('div').appendChild(t);
  });

  /* przyciski z tematem: wypełniają pole „Czego dotyczy?” */
  var temat = d.getElementById('f-temat');
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-topic]'); if (!a || !a.dataset.topic) return;
    [].some.call(temat.options, function (o) { if (o.text === a.dataset.topic) { temat.value = o.value; return true; } });
  });

  /* formularz: wysyłka bez otwierania poczty (Netlify Forms na qmala.pl przez ukryty iframe) */
  (function () {
    var form = d.getElementById('wycena'); if (!form) return;
    var body = form.querySelector('.form-body'), done = d.getElementById('f-done'), err = d.getElementById('f-err'),
        send = d.getElementById('f-send'), email = d.getElementById('f-email'), tel = d.getElementById('f-tel'), opis = d.getElementById('f-opis');
    var label = send.innerHTML;
    var sink = d.createElement('iframe'); sink.name = 'wycena-sink'; sink.title = 'Wysyłka formularza'; sink.hidden = true; d.body.appendChild(sink);
    var endpoint = /qmala\.pl$|netlify\.app$/.test(location.hostname) ? '/' : 'https://qmala.pl/';
    function submit() {
      return new Promise(function (res, rej) {
        var t = setTimeout(function () { sink.onload = null; rej(); }, 20000);
        sink.onload = function () { clearTimeout(t); sink.onload = null; res(); };
        form.setAttribute('action', endpoint); form.setAttribute('target', 'wycena-sink'); form.submit();
      });
    }
    function showErr(text, field, link) {
      err.textContent = text;
      if (link) { var a = d.createElement('a'); a.href = link.href; a.textContent = link.text; err.appendChild(d.createTextNode(' ')); err.appendChild(a); }
      err.hidden = false; if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    }
    function strong(s) { var n = d.createElement('strong'); n.textContent = s; return n; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true; email.removeAttribute('aria-invalid'); tel.removeAttribute('aria-invalid');
      var em = email.value.trim(), ph = tel.value.trim();
      if (!em && !ph) return showErr('Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.', email);
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return showErr('Sprawdź adres e-mail. Powinien wyglądać tak: nazwa@domena.pl.', email);
      if (!em && ph.replace(/\D/g, '').length < 9) return showErr('Numer telefonu jest za krótki. Podaj co najmniej 9 cyfr.', tel);
      send.disabled = true; send.textContent = 'Wysyłam…';
      submit().then(function () {
        var p = d.getElementById('f-done-p'); p.textContent = '';
        if (em) { p.append('Dostaliśmy Twoje zapytanie z adresu ', strong(em), '. Odpiszemy na ten adres.'); if (ph) p.append(' Możemy też zadzwonić na ', strong(ph), '.'); }
        else p.append('Dostaliśmy Twoje zapytanie. Oddzwonimy na numer ', strong(ph), '.');
        body.hidden = true; done.hidden = false; done.focus();
      }, function () {
        var txt = ['Temat: ' + temat.value, 'Opis: ' + (opis.value.trim() || '-'), 'E-mail: ' + (em || '-'), 'Telefon: ' + (ph || '-')].join('\n');
        showErr('Nie udało się wysłać. Wpisane dane zostały w formularzu. Spróbuj jeszcze raz albo zadzwoń.', null,
          { href: 'mailto:' + form.dataset.mail + '?subject=' + encodeURIComponent('Zapytanie o wycenę: ' + temat.value) + '&body=' + encodeURIComponent(txt), text: 'Napisz z własnej poczty.' });
      }).then(function () { send.disabled = false; send.innerHTML = label; });
    });
    d.getElementById('f-again').addEventListener('click', function () { form.reset(); done.hidden = true; body.hidden = false; temat.focus(); });
  })();
})();
