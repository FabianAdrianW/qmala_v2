/* Qmala v3 */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* wejście hero lub nagłówka podstrony; przy pierwszej wizycie po intro (przewód, dioda, odsłonięcie) */
  var top = d.querySelector('.hero, .phead'), shown = false;
  function topIn() { if (!top || shown) return; shown = true; top.classList.add('ready'); top.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); }); }
  var intro = d.getElementById('intro');
  var introOn = intro && !d.documentElement.classList.contains('no-intro') && getComputedStyle(intro).display !== 'none';
  if (introOn) {
    var tIn = setTimeout(topIn, 1950), tEnd = setTimeout(end, 2750);
    function end() { intro.classList.add('done'); }
    function skip() { clearTimeout(tIn); clearTimeout(tEnd); intro.classList.add('skip'); topIn(); setTimeout(end, 320); d.removeEventListener('keydown', skip); }
    intro.addEventListener('click', skip); d.addEventListener('keydown', skip);
    setTimeout(function () { d.removeEventListener('keydown', skip); }, 2750);
  } else {
    if (intro) intro.classList.add('done');
    var heroImg = d.querySelector('.hero-img');
    if (heroImg && !heroImg.complete) { heroImg.addEventListener('load', topIn, { once: true }); setTimeout(topIn, 1200); }
    else requestAnimationFrame(function () { requestAnimationFrame(topIn); });
  }

  /* film w hero: bez oszczędzania danych i bez ograniczenia ruchu; plik gra do przodu i do tyłu, więc pętla jest płynna */
  var vid = d.querySelector('.hero-vid'), conn = navigator.connection || {};
  if (vid && !reduce && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || '')) {
    w.addEventListener('load', function () {
      setTimeout(function () {
        vid.loop = true; vid.src = vid.dataset.src;
        vid.addEventListener('canplaythrough', function () {
          var p = vid.play(); if (p && p.then) p.then(function () { vid.classList.add('on'); }, function () {});
        }, { once: true });
        vid.load();
      }, 800);
    });
  }

  /* wejścia przy przewijaniu */
  var io = 'IntersectionObserver' in w && !reduce ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }) : null;
  d.querySelectorAll('.rv').forEach(function (n) { if (top && top.contains(n)) return; io ? io.observe(n) : n.classList.add('in'); });

  /* schemat „jak działamy”: prąd płynie przez węzły raz */
  var circ = d.getElementById('circuit');
  if (circ) {
    var wrap = circ.parentNode, nodes = circ.querySelectorAll('.node');
    /* jeden ciągły przewód od pierwszego do ostatniego węzła; prąd płynie ze stałą prędkością, węzły zapalają się w chwili dojścia */
    function wire() {
      var r = wrap.getBoundingClientRect(), a = nodes[0].getBoundingClientRect(), z = nodes[nodes.length - 1].getBoundingClientRect();
      var half = parseFloat(getComputedStyle(d.documentElement).fontSize) / 2, x1 = a.left + half - r.left, x2 = z.left + half - r.left;
      wrap.style.setProperty('--wl', x1 + 'px'); wrap.style.setProperty('--ww', Math.max(0, x2 - x1) + 'px');
      wrap.style.setProperty('--wt', (a.top + a.height / 2 - r.top) + 'px');
    }
    wire(); w.addEventListener('resize', wire); if (d.fonts) d.fonts.ready.then(wire); w.addEventListener('load', wire);
    function lit() { wire(); circ.classList.add('lit'); wrap.classList.add('lit'); }
    if (!('IntersectionObserver' in w) || reduce) lit();
    else { var co = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { lit(); co.disconnect(); } }, { threshold: 0.35 }); co.observe(circ); }
  }

  /* liczniki */
  if ('IntersectionObserver' in w && !reduce) {
    var cn = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cn.unobserve(e.target);
        var el = e.target, to = +el.dataset.count, t0 = 0;
        (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: 0.6 });
    d.querySelectorAll('[data-count]').forEach(function (n) { cn.observe(n); });
  }

  /* menu mobilne z pułapką fokusa */
  var nav = d.getElementById('nav'), tog = d.getElementById('nav-toggle'), links = d.getElementById('nav-links');
  function menu(open) {
    tog.setAttribute('aria-expanded', open); links.classList.toggle('open', open);
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = links.querySelector('a'); if (f) f.focus(); }
  }
  tog.addEventListener('click', function () { menu(tog.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
  d.addEventListener('keydown', function (e) {
    if (!links.classList.contains('open')) return;
    if (e.key === 'Escape') { menu(false); tog.focus(); }
    if (e.key === 'Tab') {
      var items = [tog].concat([].slice.call(links.querySelectorAll('a'))), i = items.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });

  /* pasek na telefonie: po pierwszym ekranie, schowany przy formularzu */
  var dock = d.querySelector('.dock'), contact = d.getElementById('kontakt');
  function onScroll() {
    if (!dock) return;
    var near = contact && contact.getBoundingClientRect().top < w.innerHeight;
    dock.classList.toggle('show', w.scrollY > w.innerHeight * 0.6 && !near);
  }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* rozdzielnica: przełączniki jako zakładki (strzałki, Home, End) */
  var tabs = [].slice.call(d.querySelectorAll('.svc-list [role=tab]'));
  function pick(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      d.getElementById(x.getAttribute('aria-controls')).classList.toggle('on', on);
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var k = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return; e.preventDefault(); pick(tabs[(k + tabs.length) % tabs.length], true);
    });
  });

  /* podgląd wyróżnionych realizacji */
  var vb = [].slice.call(d.querySelectorAll('.v-tabs button'));
  vb.forEach(function (b) {
    b.addEventListener('click', function () {
      vb.forEach(function (x) { var on = x === b; x.setAttribute('aria-pressed', on); d.getElementById('v-' + x.dataset.v).classList.toggle('on', on); });
    });
  });

  /* realizacje: filtry rodzaju i roku */
  var cases = [].slice.call(d.querySelectorAll('.case'));
  if (cases.length) {
    var fk = '', fy = '', chips = [].slice.call(d.querySelectorAll('.chip')), bars = [].slice.call(d.querySelectorAll('.yr-bar')), cnt = d.getElementById('count');
    function apply() {
      var n = 0;
      cases.forEach(function (c) {
        var ok = (!fk || c.dataset.kat === fk) && (!fy || c.dataset.rok === fy);
        c.classList.toggle('out', !ok); c.classList.toggle('wide-off', !!(fk || fy));
        if (ok) { n++; c.classList.remove('in-anim'); void c.offsetWidth; if (!reduce) c.classList.add('in-anim'); }
      });
      cnt.textContent = 'Pokazujemy ' + n + ' z ' + cases.length + ' obiektów';
      d.getElementById('empty').hidden = n > 0;
      chips.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.kat === fk); });
      bars.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.rok === fy); });
    }
    chips.forEach(function (b) { b.addEventListener('click', function () { fk = b.dataset.kat; apply(); }); });
    bars.forEach(function (b) { b.addEventListener('click', function () { fy = fy === b.dataset.rok ? '' : b.dataset.rok; apply(); }); });
    d.getElementById('reset').addEventListener('click', function () { fk = fy = ''; apply(); });
    d.querySelectorAll('.case-pic>img').forEach(function (img) {
      function gone() { img.remove(); }
      if (img.complete && img.naturalWidth === 0) gone(); else img.addEventListener('error', gone);
    });
  }

  /* zdjęcia z qmala.pl: brak pliku = brak kafla */
  d.querySelectorAll('.shot img').forEach(function (img) {
    function gone() { var b = img.closest('.shot'); if (b.classList.contains('doc-scan')) img.remove(); else b.remove(); }
    if (img.complete && img.naturalWidth === 0 && img.src) gone(); else img.addEventListener('error', gone);
  });

  /* lightbox */
  var lb = d.getElementById('lb');
  if (lb && lb.showModal) {
    var li = d.getElementById('lb-img'), lc = d.getElementById('lb-cap'), set = [], at = 0, opener = null;
    function show(i) { at = (i + set.length) % set.length; li.src = set[at].src; lc.textContent = set[at].cap + (set.length > 1 ? ', zdjęcie ' + (at + 1) + ' z ' + set.length : ''); }
    d.addEventListener('click', function (e) {
      var g = e.target.closest('[data-gallery]'), s = e.target.closest('.shot'); if (!g && !s) return;
      if (g) { opener = g; set = g.dataset.gallery.split('|').map(function (u) { return { src: u, cap: g.dataset.cap }; }); show(0); }
      else { opener = s; var all = [].slice.call(d.querySelectorAll('.shot[data-set="' + s.dataset.set + '"]')); set = all.map(function (x) { return { src: x.dataset.full, cap: x.dataset.cap }; }); show(all.indexOf(s)); }
      d.getElementById('lb-prev').hidden = d.getElementById('lb-next').hidden = set.length < 2;
      lb.showModal();
    });
    d.getElementById('lb-prev').addEventListener('click', function () { show(at - 1); });
    d.getElementById('lb-next').addEventListener('click', function () { show(at + 1); });
    d.getElementById('lb-x').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    lb.addEventListener('close', function () { li.removeAttribute('src'); if (opener) opener.focus(); });
  }

  /* kopiowanie */
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var t = b.textContent;
    function ok() { b.textContent = 'Skopiowano'; setTimeout(function () { b.textContent = t; }, 1600); }
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(ok, function () {});
  });

  /* przyciski z tematem wypełniają formularz */
  var temat = d.getElementById('f-temat');
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-topic]'); if (!a || !temat) return;
    [].some.call(temat.options, function (o) { if (o.text === a.dataset.topic) { temat.value = o.value; return true; } });
  });

  /* wysyłka formularzy bez otwierania poczty: Netlify Forms (na qmala.pl przez ukryty iframe) */
  var endpoint = /qmala\.pl$|netlify\.app$/.test(location.hostname) ? '/' : 'https://qmala.pl/';
  var sink = d.createElement('iframe'); sink.name = 'form-sink'; sink.title = 'Wysyłka formularza'; sink.hidden = true; d.body.appendChild(sink);
  function post(form) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { sink.onload = null; rej(); }, 20000);
      sink.onload = function () { clearTimeout(t); sink.onload = null; res(); };
      form.setAttribute('action', endpoint); form.setAttribute('target', 'form-sink'); form.submit();
    });
  }
  function errOut(el, text, field, link) {
    el.textContent = text;
    if (link) { var a = d.createElement('a'); a.href = link; a.textContent = 'Napisz z własnej poczty.'; el.append(' ', a); }
    el.hidden = false; if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }
  function strong(s) { var n = d.createElement('strong'); n.textContent = s; return n; }
  function busy(btn, on) { if (on) { btn.dataset.l = btn.innerHTML; btn.disabled = true; btn.textContent = 'Wysyłam…'; } else { btn.disabled = false; btn.innerHTML = btn.dataset.l; } }

  var fw = d.getElementById('wycena');
  if (fw) {
    var em = d.getElementById('f-email'), ph = d.getElementById('f-tel'), er = d.getElementById('f-err'), sb = d.getElementById('f-send');
    fw.addEventListener('submit', function (e) {
      e.preventDefault(); er.hidden = true; em.removeAttribute('aria-invalid'); ph.removeAttribute('aria-invalid');
      var m = em.value.trim(), p = ph.value.trim();
      if (!m && !p) return errOut(er, 'Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.', em);
      if (m && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) return errOut(er, 'Sprawdź adres e-mail. Powinien wyglądać tak: nazwa@domena.pl.', em);
      if (!m && p.replace(/\D/g, '').length < 9) return errOut(er, 'Numer telefonu jest za krótki. Podaj co najmniej 9 cyfr.', ph);
      busy(sb, true);
      post(fw).then(function () {
        var o = d.getElementById('f-done-p'); o.textContent = '';
        if (m) { o.append('Dostaliśmy zapytanie z adresu ', strong(m), '. Odpiszemy na ten adres.'); if (p) o.append(' Możemy też zadzwonić na ', strong(p), '.'); }
        else o.append('Dostaliśmy zapytanie. Oddzwonimy na numer ', strong(p), '.');
        fw.querySelector('.form-body').hidden = true; var dn = d.getElementById('f-done'); dn.hidden = false; dn.focus();
      }, function () {
        var body = ['Temat: ' + temat.value, 'Opis: ' + (d.getElementById('f-opis').value.trim() || '-'), 'E-mail: ' + (m || '-'), 'Telefon: ' + (p || '-')].join('\n');
        errOut(er, 'Nie udało się wysłać. Dane zostały w formularzu. Spróbuj jeszcze raz albo zadzwoń.', null, 'mailto:' + fw.dataset.mail + '?subject=' + encodeURIComponent('Zapytanie o wycenę: ' + temat.value) + '&body=' + encodeURIComponent(body));
      }).then(function () { busy(sb, false); });
    });
    d.getElementById('f-again').addEventListener('click', function () { fw.reset(); d.getElementById('f-done').hidden = true; fw.querySelector('.form-body').hidden = false; temat.focus(); });
  }

  var fc = d.getElementById('cv');
  if (fc) {
    var file = d.getElementById('cv-file'), drop = fc.querySelector('.drop'), nm = d.getElementById('cv-name'), ce = d.getElementById('cv-err'), cs = d.getElementById('cv-send');
    file.addEventListener('change', function () { var f = file.files[0]; nm.textContent = f ? f.name : 'Wybierz plik albo upuść go tutaj'; drop.classList.toggle('has', !!f); });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('over'); }); });
    fc.addEventListener('submit', function (e) {
      e.preventDefault(); ce.hidden = true;
      var f = file.files[0];
      if (!f) return errOut(ce, 'Dołącz plik z CV.', file);
      if (f.size > 8e6) return errOut(ce, 'Plik jest większy niż 8 MB. Wyślij mniejszy albo mailem.', file);
      busy(cs, true);
      post(fc).then(function () { fc.querySelector('.form-body').hidden = true; var dn = d.getElementById('cv-done'); dn.hidden = false; dn.focus(); },
        function () { errOut(ce, 'Nie udało się wysłać. Spróbuj jeszcze raz.', null, 'mailto:' + fc.dataset.mail + '?subject=CV'); })
        .then(function () { busy(cs, false); });
    });
  }
})();
