/* =========================================================
   main.js — shared core for "A Little World for Thirandee"
   - Defines window.LW (state, helpers, icons, sound, navigation)
   - Builds the welcome + home screens
   - Every other file (memory.js, quiz.js ...) plugs into LW.mods
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'lw_thirandee_v1';

  var LW = window.LW = {
    mods: {},   // each module registers { init(), enter() }
    // The 8 things that count towards unlocking the final letter
    CORE: ['memory', 'quiz', 'gifts', 'hearts', 'letters', 'hug', 'distance', 'daily'],
    state: null
  };

  /* ------------------------------------------------------
     EDIT HERE: the names / lines used on the welcome screen
     ------------------------------------------------------ */
  var TEXT = {
    herName: 'Thirandee',
    welcomeFirst: 'Hey Thirandee, someone made something for you...',
    welcomeBack: 'Hey Thirandee, you came back... I\'m so happy.'
  };

  /* ------------------------------------------------------
     STATE (saved in localStorage so progress is never lost)
     ------------------------------------------------------ */
  var DEFAULT_STATE = {
    entered: 0,          // number of times she entered
    done: {},            // completed core activities
    garden: [],          // unlocked garden item ids
    boxes: [],           // opened gift box ids
    letters: [],         // opened letter ids
    bestHearts: 0,
    quizBest: 0,
    lastDaily: '',       // YYYY-MM-DD of last daily surprise
    dailyDays: 0,        // how many different days she visited the surprise
    dailySeen: [],       // indexes of messages already shown
    finalSeen: false,
    photos: [],          // her uploaded photos [{src, cap}]
    sound: true
  };

  LW.load = function () {
    var s;
    try { s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { s = null; }
    LW.state = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_STATE)), s || {});
  };

  LW.save = function () {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(LW.state)); return true; }
    catch (e) { return false; } // storage full (e.g. too many photos)
  };

  LW.today = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  /* ------------------------------------------------------
     DOM helpers
     ------------------------------------------------------ */
  var $ = LW.$ = function (sel, root) { return (root || document).querySelector(sel); };
  LW.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  LW.rand = function (a, b) { return a + Math.random() * (b - a); };
  LW.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  LW.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  /* ------------------------------------------------------
     ICONS (inline SVG so there are no image files to load)
     ------------------------------------------------------ */
  var ICONS = {
    // --- small symbols used on memory cards, boxes, messages ---
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2 0 3.5 1 5.3 3 1.8-2 3.3-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="#ff7eb6"/><path d="M7 8c.8-1 2-1.2 2.8-.6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
    flower: '<svg viewBox="0 0 24 24"><g fill="#b794f6"><circle cx="12" cy="6" r="3.8"/><circle cx="17.7" cy="10.1" r="3.8"/><circle cx="15.5" cy="16.8" r="3.8"/><circle cx="8.5" cy="16.8" r="3.8"/><circle cx="6.3" cy="10.1" r="3.8"/></g><circle cx="12" cy="12" r="3" fill="#ffe08a"/></svg>',
    candy: '<svg viewBox="0 0 24 24"><path d="M7 12 2 8v8zM17 12l5-4v8z" fill="#ffd1ea"/><circle cx="12" cy="12" r="5.5" fill="#ff8fc4"/><path d="M8.5 9c2 .6 5 4.4 7 6M10 7c2.5.6 5.5 4 6.8 6.6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6 6 20.9l1.3-6.7-5-4.7 6.8-.8z" fill="#ffd98e"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="#cdb9ff"/><circle cx="14" cy="14" r="1" fill="#a68de0"/><circle cx="10" cy="17" r=".8" fill="#a68de0"/></svg>',
    butterfly: '<svg viewBox="0 0 24 24"><path d="M12 12C8 3 2 5 3 10c.6 3 4 4 9 2zM12 12c4-9 10-7 9-2-.6 3-4 4-9 2z" fill="#ff9fd0"/><path d="M12 12c-4 1-7 3-5 7 1.5 2.5 5 1 5-7zM12 12c4 1 7 3 5 7-1.5 2.5-5 1-5-7z" fill="#b794f6"/><path d="M12 8v10" stroke="#5a2d9e" stroke-width="1.4" stroke-linecap="round"/></svg>',

    // --- bigger, light-coloured icons for the home cards ---
    c_memory: '<svg viewBox="0 0 40 40" class="ic"><rect x="4" y="8" width="18" height="24" rx="4" fill="#b794f6" transform="rotate(-10 13 20)"/><rect x="16" y="7" width="18" height="24" rx="4" fill="#fff" transform="rotate(8 25 19)"/><path d="M25 25s-5-3-6.2-6.2c-.9-2.4.5-4.3 2.7-4.3 1.3 0 2.2.7 3.5 2 1.3-1.300 2.2-2 3.500-2 2.200 0 3.600 1.900 2.700 4.300C30 22 25 25 25 25z" fill="#ff7eb6" transform="translate(0 -1)"/></svg>',
    c_quiz: '<svg viewBox="0 0 40 40" class="ic"><circle cx="20" cy="20" r="16" fill="#b794f6"/><text x="20" y="28" text-anchor="middle" font-size="24" font-weight="700" fill="#fff" font-family="Georgia,serif">?</text><circle cx="31" cy="9" r="3" fill="#ffd98e"/></svg>',
    c_gifts: '<svg viewBox="0 0 40 40" class="ic"><rect x="6" y="16" width="28" height="19" rx="3" fill="#ff8fc4"/><rect x="4" y="11" width="32" height="8" rx="3" fill="#ffb3d9"/><rect x="18" y="11" width="4" height="24" fill="#fff"/><path d="M20 11c-2-6-9-6-8-2s6 2 8 2zM20 11c2-6 9-6 8-2s-6 2-8 2z" fill="#fff"/></svg>',
    c_hearts: '<svg viewBox="0 0 40 40" class="ic"><path d="M20 35S6 27 4.500 17.500C3.700 12 7.500 8 12 8c3 0 5.500 1.500 8 4.500C22.500 9.500 25 8 28 8c4.500 0 8.300 4 7.500 9.500C34 27 20 35 20 35z" fill="#ff7eb6"/><path d="M11 14c1.200-1.500 3-1.800 4.200-.9" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
    c_letters: '<svg viewBox="0 0 40 40" class="ic"><rect x="4" y="9" width="32" height="23" rx="4" fill="#fff"/><path d="M5 11l15 12L35 11" stroke="#b794f6" stroke-width="2.500" fill="none" stroke-linejoin="round"/><circle cx="20" cy="22" r="4" fill="#ff7eb6"/></svg>',
    c_hug: '<svg viewBox="0 0 40 40" class="ic"><circle cx="13" cy="12" r="6" fill="#cdb9ff"/><circle cx="27" cy="12" r="6" fill="#ffb3d9"/><path d="M5 34c0-9 5-14 11-14h8c6 0 11 5 11 14z" fill="#b794f6"/><path d="M20 30s-4-2.500-4.800-5c-.6-1.800.4-3.200 2-3.200 1 0 1.800.5 2.800 1.600 1-1.100 1.800-1.600 2.800-1.600 1.600 0 2.600 1.400 2 3.200C24 27.500 20 30 20 30z" fill="#fff"/></svg>',
    c_distance: '<svg viewBox="0 0 40 40" class="ic"><path d="M9 28C14 8 26 8 31 28" stroke="#ffd1ea" stroke-width="2.500" stroke-dasharray="3 4" fill="none" stroke-linecap="round"/><circle cx="9" cy="29" r="4.500" fill="#cdb9ff"/><circle cx="31" cy="29" r="4.500" fill="#ffb3d9"/><path d="M20 20s-4-2.500-4.800-5c-.6-1.800.4-3.200 2-3.200 1 0 1.800.5 2.800 1.600 1-1.100 1.800-1.600 2.800-1.600 1.600 0 2.600 1.400 2 3.200C24 17.500 20 20 20 20z" fill="#ff7eb6"/></svg>',
    c_garden: '<svg viewBox="0 0 40 40" class="ic"><path d="M20 38V22" stroke="#7fd6a0" stroke-width="3" stroke-linecap="round"/><path d="M20 32c-6 0-8-4-8-6 5 0 8 2 8 6zM20 30c6 0 8-4 8-6-5 0-8 2-8 6z" fill="#7fd6a0"/><g fill="#ffb3d9"><circle cx="20" cy="9" r="5"/><circle cx="27" cy="14" r="5"/><circle cx="24.500" cy="21" r="5"/><circle cx="15.500" cy="21" r="5"/><circle cx="13" cy="14" r="5"/></g><circle cx="20" cy="16" r="4" fill="#ffd98e"/></svg>',
    c_gallery: '<svg viewBox="0 0 40 40" class="ic"><rect x="5" y="6" width="30" height="28" rx="3" fill="#fff"/><rect x="8.500" y="9.500" width="23" height="17" rx="2" fill="#cdb9ff"/><circle cx="25" cy="14.500" r="3" fill="#fff"/><path d="M8.500 26.500l7-8 5 5 4-4 7 7z" fill="#9b72e6"/></svg>',
    daily: '<svg viewBox="0 0 40 40"><path d="M20 3l4.500 10.500L36 15l-8.500 7.800L30 34 20 28l-10 6 2.500-11.200L4 15l11.500-1.500z" fill="#ffd98e"/><circle cx="20" cy="19" r="14" fill="none" stroke="#fff" stroke-opacity=".25"/></svg>',
    seal: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#ff7eb6"/><circle cx="20" cy="20" r="13" fill="none" stroke="#fff" stroke-opacity=".5" stroke-dasharray="2 3"/><path d="M20 28s-7-4.200-8.800-8.500C10 16.500 11.800 13 15.200 13c1.900 0 3.200.9 4.800 2.800 1.600-1.900 2.900-2.800 4.800-2.800 3.400 0 5.200 3.500 4 6.500C27 23.800 20 28 20 28z" fill="#fff"/></svg>'
  };
  LW.icon = function (name) { return ICONS[name] || ''; };

  /* ------------------------------------------------------
     SOUND — gentle chimes made with the Web Audio API.
     (No sound files needed; assets/sounds/ is there if you
      ever want to add your own music.)
     ------------------------------------------------------ */
  var audioCtx = null;
  function getCtx() {
    if (!LW.state.sound) return null;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { return null; }
    return audioCtx;
  }
  function note(ctx, freq, start, dur, vol) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
  }
  var SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // soft pentatonic
  LW.chime = function (kind) {
    var ctx = getCtx(); if (!ctx) return;
    if (kind === 'win') { [0, 2, 3, 4, 5].forEach(function (n, i) { note(ctx, SCALE[n], i * 0.11, 0.7, 0.07); }); }
    else if (kind === 'open') { [2, 4, 5].forEach(function (n, i) { note(ctx, SCALE[n], i * 0.09, 0.6, 0.06); }); }
    else if (kind === 'wrong') { note(ctx, 330, 0, 0.35, 0.05); }
    else if (kind === 'catch') { note(ctx, LW.pick(SCALE), 0, 0.35, 0.05); }
    else { note(ctx, LW.pick(SCALE.slice(0, 4)), 0, 0.4, 0.04); }
  };

  /* ------------------------------------------------------
     Little UI helpers: toast, sparkles, modal
     ------------------------------------------------------ */
  var toastTimer;
  LW.toast = function (msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  var SPARK_COLORS = ['#ffd98e', '#ffb3d9', '#cdb9ff', '#ffffff'];
  LW.sparkleAt = function (x, y, count) {
    var layer = $('#sparkle-layer'); count = count || 7;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      var ang = Math.random() * Math.PI * 2, dist = LW.rand(24, 64);
      s.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--dx:' + Math.cos(ang) * dist + 'px;--dy:' + Math.sin(ang) * dist + 'px;' +
        'background:' + LW.pick(SPARK_COLORS) + ';clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)';
      layer.appendChild(s);
      setTimeout((function (el) { return function () { el.remove(); }; })(s), 950);
    }
  };
  // Burst of sparkles around the middle of any element
  LW.sparkleEl = function (el, count) {
    var r = el.getBoundingClientRect(); LW.sparkleAt(r.left + r.width / 2, r.top + r.height / 2, count || 10);
  };

  var modalOnClose = null;
  LW.modal = function (html, onClose) {
    $('#modal-content').innerHTML = html;
    $('#modal').classList.add('show'); $('#modal').setAttribute('aria-hidden', 'false');
    $('#modal-card').scrollTop = 0;
    modalOnClose = onClose || null;
    LW.$$('[data-close]', $('#modal')).forEach(function (b) { b.addEventListener('click', LW.closeModal); });
  };
  LW.closeModal = function () {
    $('#modal').classList.remove('show'); $('#modal').setAttribute('aria-hidden', 'true');
    var cb = modalOnClose; modalOnClose = null; if (cb) cb();
  };

  /* ------------------------------------------------------
     Floating hearts in the background (capped for performance)
     ------------------------------------------------------ */
  var HEART_SVG = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2 0 3.5 1 5.3 3 1.8-2 3.300-3 5.300-3 3.700 0 5.800 3.900 4.300 7.300C19.500 16.400 12 21 12 21z" fill="currentColor"/></svg>';
  var HEART_COLORS = ['#ffb3d9', '#cdb9ff', '#ff8fc4', '#e0ccff'];
  function spawnHeart() {
    if (document.hidden) return;
    var layer = $('#hearts-layer');
    if (layer.children.length > 12) return;
    var h = document.createElement('span'), size = LW.rand(12, 28);
    h.className = 'float-heart';
    h.style.cssText = 'left:' + LW.rand(2, 96) + '%;width:' + size + 'px;height:' + size + 'px;color:' + LW.pick(HEART_COLORS) +
      ';animation-duration:' + LW.rand(10, 18) + 's;';
    h.innerHTML = HEART_SVG;
    layer.appendChild(h);
    h.addEventListener('animationend', function () { h.remove(); });
  }

  /* ------------------------------------------------------
     Navigation between screens
     ------------------------------------------------------ */
  var current = 'welcome';
  LW.go = function (name, fromPop) {
    LW.$$('.screen.active').forEach(function (s) { s.classList.remove('active'); });
    var el = $('#screen-' + name); if (!el) return;
    el.classList.add('active'); window.scrollTo(0, 0);
    if (!fromPop && name !== 'home' && name !== 'welcome') { try { history.pushState({ s: name }, ''); } catch (e) {} }
    var prev = current; current = name;
    if (prev !== name && LW.mods[prev] && LW.mods[prev].leave) LW.mods[prev].leave();
    if (name === 'home') LW.renderHome();
    if (LW.mods[name] && LW.mods[name].enter) LW.mods[name].enter();
  };
  window.addEventListener('popstate', function () { if (current !== 'home' && current !== 'welcome') { LW.closeModal(); LW.go('home', true); } });

  /* ------------------------------------------------------
     Progress: marking things as done, unlocking things
     ------------------------------------------------------ */
  LW.isDone = function (k) { return !!LW.state.done[k]; };
  LW.doneCount = function () { return LW.CORE.filter(LW.isDone).length; };
  LW.allDone = function () { return LW.doneCount() === LW.CORE.length; };

  // Call whenever anything changes (saves, updates garden, updates home)
  LW.touch = function () {
    LW.save();
    if (LW.mods.garden && LW.mods.garden.sync) LW.mods.garden.sync();
    LW.renderHome();
  };

  LW.complete = function (key) {
    if (LW.state.done[key]) return false;
    LW.state.done[key] = true;
    var wasAll = LW.allDone();
    LW.touch();
    if (wasAll) setTimeout(function () { LW.toast('Everything discovered — a special letter is waiting for you ❤️'); LW.chime('win'); }, 900);
    return true;
  };

  /* ------------------------------------------------------
     HOME SCREEN
     ------------------------------------------------------ */
  var CARDS = [
    { k: 'memory',   t: 'Love Memory Challenge', d: 'Match the little things',  core: true },
    { k: 'quiz',     t: 'How Well Do You Know Us?', d: 'A funny little quiz', core: true },
    { k: 'gifts',    t: 'Mystery Gifts',          d: 'Six boxes to open',       core: true },
    { k: 'hearts',   t: 'Catch the Hearts',       d: 'Be quick, my love',       core: true },
    { k: 'letters',  t: 'Secret Letters',         d: 'Words from my heart',     core: true },
    { k: 'hug',      t: 'Virtual Hug',            d: 'Because I can\'t be there', core: true },
    { k: 'distance', t: 'Distance Doesn\'t Matter', d: 'Kandy to Kalutara',     core: true },
    { k: 'garden',   t: 'Our Little Garden',      d: 'Watch it grow',           core: false },
    { k: 'gallery',  t: 'Our Memories',           d: 'Our pictures, together',  core: false, wide: true }
  ];

  function greeting() {
    var h = new Date().getHours();
    var g = h < 5 ? 'Still awake, my love' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night';
    return g === 'Still awake, my love' ? g + '?' : g + ', ' + TEXT.herName;
  }

  var homeBuilt = false;
  function buildHome() {
    var grid = $('#home-grid'); grid.innerHTML = '';
    CARDS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'act-card fresh' + (c.wide ? ' wide' : '');
      b.dataset.key = c.k; b.style.animationDelay = (i * 0.05) + 's';
      b.innerHTML = '<span class="check">✓</span>' + LW.icon('c_' + c.k) +
        '<span><h3>' + c.t + '</h3><small>' + c.d + '</small></span>';
      b.addEventListener('click', function () { LW.chime(); LW.go(c.k); });
      grid.appendChild(b);
    });
    homeBuilt = true;
  }

  LW.renderHome = function () {
    if (!homeBuilt) buildHome();
    $('#home-hello').textContent = greeting();
    LW.$$('.act-card', $('#home-grid')).forEach(function (b) {
      var c = CARDS.filter(function (x) { return x.k === b.dataset.key; })[0];
      var done = c.core ? LW.isDone(c.k) :
        (c.k === 'garden' ? LW.state.garden.length >= 6 : LW.state.photos.length > 0);
      b.classList.toggle('done', done);
    });
    var n = LW.doneCount(), total = LW.CORE.length;
    $('#progress-fill').style.width = (n / total * 100) + '%';
    $('#progress-text').textContent = n + ' / ' + total + ' discovered';

    // Daily surprise button
    $('.daily-star', $('#daily-btn')).innerHTML = LW.icon('daily');
    $('#daily-sub').textContent = LW.state.lastDaily === LW.today() ? 'You already opened today\'s — tap for another' : 'Tap to see what I wrote for you today';

    // Final letter card
    var fc = $('#final-card'), unlocked = LW.allDone();
    fc.classList.toggle('locked', !unlocked);
    $('.final-seal', fc).innerHTML = LW.icon('seal');
    $('#final-sub').textContent = unlocked ? (LW.state.finalSeen ? 'Read it again, any time' : 'It\'s ready. Open it when you\'re ready.') :
      (total - n) + ' more thing' + (total - n === 1 ? '' : 's') + ' to discover to unlock it';
  };

  /* ------------------------------------------------------
     WELCOME SCREEN (typing line + magical transition)
     ------------------------------------------------------ */
  function typeLine(el, text, speed, done) {
    el.classList.add('caret'); el.textContent = ''; var i = 0;
    (function step() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, speed);
      else { setTimeout(function () { el.classList.remove('caret'); }, 1500); if (done) done(); }
    })();
  }

  function setupWelcome() {
    var line = LW.state.entered ? TEXT.welcomeBack : TEXT.welcomeFirst;
    setTimeout(function () { typeLine($('#welcome-line1'), line, 55); }, 600);

    $('#enter-btn').addEventListener('click', function (e) {
      LW.chime('open');
      LW.sparkleAt(e.clientX, e.clientY, 14);
      var wipe = document.createElement('div'); wipe.className = 'wipe'; document.body.appendChild(wipe);
      LW.state.entered++; LW.save();
      setTimeout(function () { LW.go('home'); }, 560);
      setTimeout(function () { wipe.remove(); }, 1200);
    });
  }

  /* ------------------------------------------------------
     BOOT
     ------------------------------------------------------ */
  LW.boot = function () {
    LW.load();

    // Sound toggle
    var st = $('#sound-toggle');
    st.classList.toggle('off', !LW.state.sound);
    st.addEventListener('click', function () {
      LW.state.sound = !LW.state.sound; LW.save(); st.classList.toggle('off', !LW.state.sound);
      if (LW.state.sound) LW.chime('open');
    });

    // Modal close handlers
    $('#modal-close').addEventListener('click', LW.closeModal);
    $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') LW.closeModal(); });

    // Sparkles wherever she taps (cheap and charming)
    document.addEventListener('pointerdown', function (e) {
      if (current === 'hearts') return; // keep the heart game clean and fast
      LW.sparkleAt(e.clientX, e.clientY, 5);
    });

    // Back buttons ([data-go] attributes in the HTML)
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-go]') : null;
      if (b) { LW.chime(); if (history.state && history.state.s) { history.back(); } else { LW.go(b.dataset.go); } }
    });

    // Daily + final cards
    $('#daily-btn').addEventListener('click', function () { LW.chime('open'); if (LW.mods.daily) LW.mods.daily.open(); });
    $('#final-card').addEventListener('click', function () {
      if (!LW.allDone()) { LW.chime('wrong'); LW.toast('Almost... keep exploring, my love. ' + (LW.CORE.length - LW.doneCount()) + ' more to go.'); return; }
      LW.chime('win'); if (LW.mods.finalLetter) LW.mods.finalLetter.open();
    });

    // Start over: clears progress, garden, letters, scores and daily history (her added photos are kept), then reloads
    $('#reset-btn').addEventListener('click', function () {
      LW.chime();
      LW.modal('<h3 class="m-title">Start all over again?</h3>' +
        '<div class="m-body"><p>Everything will be reset: games, letters, garden and scores. You can discover it all again from the beginning. (Photos you added stay.)</p></div>' +
        '<button class="m-btn" id="reset-yes">Yes, start over</button><button class="m-btn ghost" data-close>Not now</button>');
      $('#reset-yes').addEventListener('click', function () {
        var keep = { photos: LW.state.photos, sound: LW.state.sound };
        LW.state = Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), keep);
        LW.save();
        location.reload();
      });
    });

    // Let every module prepare itself
    Object.keys(LW.mods).forEach(function (k) { if (LW.mods[k].init) LW.mods[k].init(); });

    setupWelcome();
    for (var i = 0; i < 6; i++) setTimeout(spawnHeart, i * 500);
    setInterval(spawnHeart, 1700);
    if (LW.mods.garden && LW.mods.garden.sync) LW.mods.garden.sync(true);
  };
})();
