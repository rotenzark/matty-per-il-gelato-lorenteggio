/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'matty-per-il-gelato-lorenteggio',
    /* nessun WhatsApp pubblicato: solo il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* Google (30/9/2026, orari aggiornati dall'attività 10 settimane prima): tutti i giorni 15–19:50 */
    hours: {
      0: [['15:00', '19:50']], 1: [['15:00', '19:50']], 2: [['15:00', '19:50']], 3: [['15:00', '19:50']],
      4: [['15:00', '19:50']], 5: [['15:00', '19:50']], 6: [['15:00', '19:50']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Matty per il Gelato: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.vaschetta": "The tub",
      "n.torte": "Cakes",
      "n.nonsolo": "Not just gelato",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Gelateria · Via Lorenteggio 43, Milan",
      "h.titolo": "Natural gelato and cakes to order.",
      "h.testo": "The gelateria on Via Lorenteggio, at the M4 Tolstoj stop: natural gelato, vegan and lactose-free too, and fresh pastries made to order for every celebration. Then cannoli, cassate, pastiere and Sicilian granita. Every day from 3 pm.",
      "h.chi": "from a review on Google (in Italian: «gelato, cakes and semifreddi are great, I recommend it to everyone»)",
      "h.google": "on Google, 142 reviews",
      "a.crostata": "One of their fruit tarts arranged like a mandala, seen from above: rings of strawberries, pineapple, kiwi, mandarins, raspberries and blueberries, a strawberry rose in the middle.",
      "c.crostata": "The fruit tart, made by them.",
      "s.etichetta": "The tub",
      "s.titolo": "Three flavours in a tub",
      "s.testo1": "To take home, the flavours are spread in bands in the white tub, with the spatula: side by side, stroke after stroke.",
      "s.testo2": "Here are three sets from their menu; the flavours of the day change, and for those, as they say, give us a call. Choose a set.",
      "p.titolo": "Three flavours in a tub",
      "p.desc": "The white take-away tub seen from above: the orange spatula spreads three flavours side by side, four strokes each; when a flavour is done its details appear, then the spatula goes back to the rim. Notte stellata, fresh mint and salted pistachio; mango, raspberry and lemon with no milk; or hazelnut, stracciatella and malaga.",
      "p.d0": "Notte stellata (dark chocolate with orange and lime), fresh mint and salted pistachio.",
      "p.d1": "Mango, raspberry and lemon: the sorbets with no milk and no lactose.",
      "p.d2": "Hazelnut, stracciatella and malaga (custard with raisins).",
      "p.modi": "Which set",
      "p.b1": "No milk",
      "p.b2": "Hazelnut",
      "r.etichetta": "Cakes",
      "r.titolo": "Cakes, our world",
      "r.testo1": "That is how they put it: besides gelato, fresh pastries made to order for every occasion. Birthday and anniversary cakes, number cakes, semifreddi, gelato cakes, vegan and lactose-free too.",
      "r.testo2": "Order at the gelateria or by phone: the cake, the flavours, the writing.",
      "r.ordina": "Order a cake",
      "a.semifreddo": "A glossy chocolate-glazed semifreddo with a row of raspberries and a chocolate curl.",
      "c.semifreddo": "The raspberry semifreddo.",
      "a.diciotto": "A number cake «18» made of shortcrust with custard, fresh fruit and meringues.",
      "c.diciotto": "A number cake.",
      "a.compleanno": "A white cake with «Buon compleanno» (happy birthday) written in chocolate and raspberries around the edge.",
      "c.compleanno": "Happy birthday.",
      "a.anniversario": "A white iced cake with «Buon 25° anniversario» (happy 25th anniversary) and sugar flowers.",
      "c.anniversario": "For an anniversary.",
      "a.rose": "A pink two-tier cake with sugar roses.",
      "c.rose": "With sugar roses.",
      "u.etichetta": "Not just gelato",
      "u.titolo": "Also from the counter",
      "u.sotto": "As on their flyer: the pastries and the southern specialities, next to the gelato.",
      "a.zeppole": "Zeppole with custard and sour cherry.",
      "u.zeppole": "Zeppole",
      "a.cannoncini": "Puff pastry cannoncini with custard and icing sugar.",
      "u.cannoncini": "Cannoncini",
      "a.crostatine": "A small strawberry tart among cream puffs.",
      "u.crostatine": "Small tarts",
      "a.pastiere": "Single-portion pastiere.",
      "u.pastiere": "Pastiere",
      "u.cannoli": "Sicilian cannoli",
      "u.cassate": "Sicilian cassate",
      "u.granite": "Sicilian granita",
      "u.crepes": "Crêpes",
      "u.tiramisu": "Tiramisù",
      "u.panettoni": "At Christmas, panettoni to book",
      "u.nota": "The photos come from their Facebook page, their Instagram and their Google listing.",
      "d.etichetta": "Reviews",
      "d.titolo": "Gelato and semifreddi, cakes for the celebrations",
      "d.google": "on Google, 142 reviews",
      "d.g2s": "Google, 2 weeks ago",
      "d.g1a": "Google, a year ago",
      "d.trip": "TripAdvisor, May 2025",
      "d.nota": "From the reviews on Google and TripAdvisor, as they were written. The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Every day, from 3 pm",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "Hours from their Google listing (September 2026). In summer, at Christmas and on holidays it is best to call.",
      "o.mappa": "Map: Matty per il Gelato, Via Lorenteggio 43, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Lorenteggio 43, 20146 Milan, on the corner of Via Vignoli",
      "o.metro": "By metro",
      "o.metrov": "M4 Tolstoj, about 140 metres away; M4 Frattini, about 350",
      "o.bus": "By bus",
      "o.busv": "The stop is right in front, on Via Lorenteggio at the corner of Via Vignoli",
      "o.casa": "At home",
      "o.casav": "Home delivery with Just Eat, Deliveroo and Glovo",
      "o.tel": "Phone",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "When are you open?",
      "q.1r": "Every day from 3 pm to 7:50 pm, according to their Google listing of September 2026. In summer and on holidays it is best to call.",
      "q.2": "Do you have vegan and lactose-free gelato?",
      "q.2r": "Yes: they say so themselves, «gelato also vegan and lactose-free»; on their menu the fruit sorbets have no milk and no lactose.",
      "q.3": "How do I order a cake?",
      "q.3r": "Drop by the gelateria or call 351 946 7837: they make fresh pastries to order for every occasion, from birthday cakes to semifreddi and gelato cakes.",
      "q.4": "Do you deliver?",
      "q.4r": "Yes, with Just Eat, Deliveroo and Glovo.",
      "q.5": "How do I get there?",
      "q.5r": "Via Lorenteggio 43: the M4 Tolstoj stop is about 140 metres away, M4 Frattini about 350; the bus stops right in front, on Via Lorenteggio at the corner of Via Vignoli.",
      "f2.orario": "Every day 3 pm–7:50 pm",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos come from their Facebook page, their Instagram and their Google listing; hours and reviews from Google and TripAdvisor (September 2026). We drew the tub ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ MATTY PER IL GELATO — gelateria e torte su ordinazione, Via Lorenteggio 43 ══════════
     La pagina è fatta come il loro volantino (blu, il corsivo bianco, i tondi di foto).
     la FIRMA — «la vaschetta»: la vaschetta bianca da asporto vista dall'alto e la spatola arancione del loro reel della menta. Lo stato è
     M (la terna), T (0…1: la spatola arriva dal riposo, stende 12 spatolate, quattro per gusto, avanti e indietro; finito un gusto
     compaiono i suoi dettagli; poi torna a riposo) e V (la vaschetta: 0 al suo posto, fino a 1 portata via a destra, da −1 a 0 ne arriva
     una vuota da sinistra). Senza JS e alla fine: la prima terna, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la vaschetta vuota,
     la spatola a riposo, nello stesso posto. Scegliere: la vaschetta piena va via, ne arriva una vuota, si riempie. Reduced-motion: tutto
     subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[600,420],"riposo":{"x":522,"y":334},"spatolate":[{"b":0,"da":[78,40],"c":[98,210],"a":[94,380]},{"b":0,"da":[128,380],"c":[132,210],"a":[112,40]},{"b":0,"da":[148,40],"c":[168,210],"a":[164,380]},{"b":0,"da":[198,380],"c":[202,210],"a":[182,40]},{"b":1,"da":[219.333,40],"c":[215.333,210],"a":[235.333,380]},{"b":1,"da":[269.333,380],"c":[249.333,210],"a":[253.333,40]},{"b":1,"da":[289.333,40],"c":[285.333,210],"a":[305.333,380]},{"b":1,"da":[339.333,380],"c":[319.333,210],"a":[323.333,40]},{"b":2,"da":[360.667,40],"c":[380.667,210],"a":[376.667,380]},{"b":2,"da":[410.667,380],"c":[414.667,210],"a":[394.667,40]},{"b":2,"da":[430.667,40],"c":[450.667,210],"a":[446.667,380]},{"b":2,"da":[480.667,380],"c":[484.667,210],"a":[464.667,40]}],"fasi":{"arriva":{"t":0,"d":0.05},"spatolate":[{"t":0.05,"d":0.064},{"t":0.12,"d":0.064},{"t":0.19,"d":0.064},{"t":0.26,"d":0.064},{"t":0.33,"d":0.064},{"t":0.4,"d":0.064},{"t":0.47,"d":0.064},{"t":0.54,"d":0.064},{"t":0.61,"d":0.064},{"t":0.68,"d":0.064},{"t":0.75,"d":0.064},{"t":0.82,"d":0.064}],"dettagli":[{"t":0.324,"d":0.03},{"t":0.604,"d":0.03},{"t":0.884,"d":0.03}],"torna":{"t":0.92,"d":0.08}},"tempi":{"inizio":300,"stende":4200,"servi":380,"arriva":380,"stendeV":3400,"via":320,"entra":320},"terne":[{"nome":"Notte stellata · Menta fresca · Pistacchio salato","gusti":["Notte stellata","Menta fresca","Pistacchio salato"]},{"nome":"Senza latte: mango, lampone, limone","gusti":["Mango","Lampone","Limone"]},{"nome":"Nocciola · Stracciatella · Malaga","gusti":["Nocciola","Stracciatella","Malaga"]}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('vaschetta-firma'), svgF = prendi('vaschettaSvg'), tuttoF = prendi('vaschettaTutto'), leggiF = prendi('vaschettaLeggi'), spatolaF = prendi('vaschettaSpatola');
  var SPAT = svgF ? DATI.terne.map(function (_, m) { return [].slice.call(svgF.querySelectorAll('.vaschetta__set[data-m="' + m + '"] .spatolata')).sort(function (a, b) { return +a.getAttribute('data-i') - +b.getAttribute('data-i'); }); }) : [];
  var DEC = svgF ? DATI.terne.map(function (_, m) { return [].slice.call(svgF.querySelectorAll('.vaschetta__set[data-m="' + m + '"] .decoro')).sort(function (a, b) { return +a.getAttribute('data-b') - +b.getAttribute('data-b'); }); }) : [];
  var BOTTONI = [].slice.call(document.querySelectorAll('.vaschetta__modi button[data-modo]'));
  var TF = DATI.tempi, FA = DATI.fasi, SP = DATI.spatolate, RIP = DATI.riposo;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la fine di una fase arriva a 1 esatto (#256) */
  var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
  var q2 = function (a, c, b, p) { return (1 - p) * (1 - p) * a + 2 * (1 - p) * p * c + p * p * b; };
  /* dove sta la spatola a T: arriva dal riposo, segue la punta della spatolata in corso (quadratica), fra due spatolate va dritta
     dalla fine di una all'inizio dell'altra, alla fine torna a riposo */
  function spatolaA(t) {
    var n = SP.length, S0 = SP[0], SN = SP[n - 1];
    if (t < FA.spatolate[0].t) { var e = CURVE.dolce(fase(t, FA.arriva)); return [RIP.x + (S0.da[0] - RIP.x) * e, RIP.y + (S0.da[1] - RIP.y) * e]; }
    if (t >= FA.torna.t) { var e2 = CURVE.dolce(fase(t, FA.torna)); return [SN.a[0] + (RIP.x - SN.a[0]) * e2, SN.a[1] + (RIP.y - SN.a[1]) * e2]; }
    for (var i = 0; i < n; i++) {
      var W = FA.spatolate[i], S = SP[i];
      if (t < W.t + W.d) { var p = fase(t, W); return [q2(S.da[0], S.c[0], S.a[0], p), q2(S.da[1], S.c[1], S.a[1], p)]; }
      if (i + 1 < n && t < FA.spatolate[i + 1].t) { var g = c01((t - W.t - W.d) / (FA.spatolate[i + 1].t - W.t - W.d)), N = SP[i + 1]; return [S.a[0] + (N.da[0] - S.a[0]) * g, S.a[1] + (N.da[1] - S.a[1]) * g]; }
    }
    return [SN.a[0], SN.a[1]];
  }
  function annunciaF(m) {
    var el = document.querySelector('.vaschetta__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale gli stessi attributi dell'HTML */
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SPAT[m].forEach(function (g, i) { var p = fase(t, FA.spatolate[i]); g.setAttribute('stroke-dashoffset', String(r3(1 - p))); g.setAttribute('opacity', p > 0 ? '1' : '0'); });
    DEC[m].forEach(function (g, b) { g.setAttribute('opacity', String(r3(fase(t, FA.dettagli[b])))); });
    var pos = spatolaA(t);
    spatolaF.setAttribute('transform', 'translate(' + r3(pos[0]) + ' ' + r3(pos[1]) + ')');
    if (v === 0) { tuttoF.removeAttribute('transform'); tuttoF.removeAttribute('opacity'); }
    else if (v > 0) { tuttoF.setAttribute('transform', 'translate(' + r3(TF.via * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 - v))); }
    else { tuttoF.setAttribute('transform', 'translate(' + r3(TF.entra * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 + v))); }
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* le vaschette nascoste delle altre terne tornano come nell'HTML (#257) */
    SPAT.forEach(function (G, k) { if (k !== destinazioneF.m) G.forEach(function (g) { g.setAttribute('stroke-dashoffset', '0'); g.setAttribute('opacity', '1'); }); });
    DEC.forEach(function (G, k) { if (k !== destinazioneF.m) G.forEach(function (g) { g.setAttribute('opacity', '1'); }); });
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa la vaschetta è vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la vaschetta vuota, la spatola a riposo */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.stende, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.stende });
  }
  /* il gesto: scegliere una terna. Se è quella che si sta già stendendo, niente; altrimenti tutto si ferma dov'è, la vaschetta va via,
     ne arriva una vuota e si riempie. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.stendeV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la vaschetta è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && tuttoF && spatolaF && SPAT.every(function (G) { return G.length === SP.length; }) && DEC.every(function (G) { return G.length === 3; }) && BOTTONI.length === DATI.terne.length) {
    try { clearTimeout(window.__attesaVaschetta); } catch (e) {}
    window.__vaschetta = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__vaschetta.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la vaschetta sotto la piega: parte quando se ne vede abbastanza; fino ad allora resta vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__vaschetta.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
