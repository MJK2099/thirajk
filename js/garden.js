/* =========================================================
   garden.js — E. Our Little Garden
   Every activity she completes grows something new here.
   Flowers, butterflies and lanterns are drawn as inline SVG.
   Tap anything to read its little message.
   ========================================================= */
(function () {
  'use strict';

  /* ---- tiny SVG helpers (viewBox is always 0 0 60 80) ---- */
  function petals(n, cx, cy, dist, rx, ry, fill, extra) {
    var s = '';
    for (var i = 0; i < n; i++) {
      s += '<ellipse cx="' + cx + '" cy="' + (cy - dist) + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" ' + (extra || '') +
        ' transform="rotate(' + (360 / n * i) + ' ' + cx + ' ' + cy + ')"/>';
    }
    return s;
  }
  var STEM = '<path d="M30 80V38" stroke="#6fcf97" stroke-width="3" stroke-linecap="round"/>';
  var LEAVES = '<path d="M30 66c-9 0-13-5-13-9 8 0 13 3 13 9zM30 60c8 0 12-5 12-9-8 0-12 3-12 9z" fill="#6fcf97"/>';
  function svg(inner) { return '<svg viewBox="0 0 60 80">' + inner + '</svg>'; }

  var ART = {
    lavender: function () {
      var s = '<path d="M30 80V22" stroke="#6fcf97" stroke-width="2.5" stroke-linecap="round"/>' + LEAVES;
      for (var i = 0; i < 6; i++) { var y = 18 + i * 7; s += '<ellipse cx="25" cy="' + y + '" rx="3.5" ry="5" fill="#a98bf0" transform="rotate(-25 25 ' + y + ')"/><ellipse cx="35" cy="' + y + '" rx="3.5" ry="5" fill="#b9a0ff" transform="rotate(25 35 ' + y + ')"/>'; }
      return svg(s + '<ellipse cx="30" cy="10" rx="3" ry="5" fill="#cdb9ff"/>');
    },
    butterfly: function () {
      return '<svg viewBox="0 0 24 24" class="flutter">' + LW.icon('butterfly').replace(/<\/?svg[^>]*>/g, '') + '</svg>';
    },
    rose: function () {
      return svg(STEM + LEAVES + '<circle cx="30" cy="30" r="15" fill="#e0527f"/><circle cx="30" cy="30" r="11" fill="#ff7eb6"/><path d="M22 28c4-6 14-6 16 0-3-3-12-3-16 0z" fill="#e0527f"/><circle cx="30" cy="30" r="7" fill="#ff9fcb"/><path d="M26 31c1-4 7-4 8 0-3-2-5-2-8 0z" fill="#e0527f"/><circle cx="30" cy="30" r="3" fill="#ffc2de"/>');
    },
    tulip: function () {
      return svg(STEM + LEAVES + '<path d="M16 18c0 14 6 22 14 22s14-8 14-22c-4 4-6 3-8-1-2 4-4 4-6 0-2 4-4 5-6 1-3 3-5 4-8 0z" fill="#c07bf0"/><path d="M30 17c-3 8-2 18 0 23 2-5 3-15 0-23z" fill="#d9a5ff"/>');
    },
    orchid: function () {
      return svg(STEM + LEAVES + '<ellipse cx="18" cy="28" rx="9" ry="6" fill="#ffd1ea" transform="rotate(-25 18 28)"/><ellipse cx="42" cy="28" rx="9" ry="6" fill="#ffd1ea" transform="rotate(25 42 28)"/><ellipse cx="30" cy="16" rx="6" ry="9" fill="#ffe3f2"/><ellipse cx="23" cy="38" rx="7" ry="5" fill="#ffb3d9" transform="rotate(30 23 38)"/><ellipse cx="37" cy="38" rx="7" ry="5" fill="#ffb3d9" transform="rotate(-30 37 38)"/><circle cx="30" cy="29" r="5" fill="#d9468f"/><circle cx="30" cy="29" r="2" fill="#ffe08a"/>');
    },
    iris: function () {
      return svg(STEM + LEAVES + petals(3, 30, 30, 11, 6, 11, '#8a5fe0') + '<path d="M30 30c-10 4-16 12-14 18 6-2 12-8 14-18zM30 30c10 4 16 12 14 18-6-2-12-8-14-18z" fill="#6f46c8"/><path d="M30 28v14" stroke="#ffd98e" stroke-width="3" stroke-linecap="round"/>');
    },
    heartbloom: function () {
      return svg(STEM + LEAVES + '<path d="M30 46S10 34 12 22c1-7 10-9 18-1 8-8 17-6 18 1 2 12-18 24-18 24z" fill="#ff6fae"/><path d="M19 22c1-3 4-4 6-3" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".7"/><circle cx="48" cy="12" r="1.8" fill="#ffd98e"/><circle cx="10" cy="14" r="1.4" fill="#ffd98e"/>');
    },
    lantern: function () {
      return svg('<path d="M30 80V10" stroke="#8a6c4a" stroke-width="2.5" stroke-linecap="round"/><path d="M30 10c8 0 12 4 12 8" stroke="#8a6c4a" stroke-width="2.5" fill="none" stroke-linecap="round"/><g class="glowfly"><line x1="42" y1="18" x2="42" y2="26" stroke="#8a6c4a" stroke-width="1.5"/><rect x="34" y="26" width="16" height="22" rx="7" fill="#ffd98e"/><rect x="34" y="26" width="16" height="22" rx="7" fill="url(#none)" opacity="0"/><path d="M38 26c-1 8-1 14 0 22M46 26c1 8 1 14 0 22" stroke="#e8a85a" stroke-width="1.2" fill="none"/><rect x="38" y="24" width="8" height="3" rx="1" fill="#b57b3e"/><rect x="38" y="47" width="8" height="3" rx="1" fill="#b57b3e"/><circle cx="42" cy="37" r="14" fill="#ffd98e" opacity=".25"/></g>');
    },
    jasmine: function () {
      var s = STEM + LEAVES;
      [[30, 22, 8], [19, 36, 6.5], [41, 34, 6.5]].forEach(function (f) { s += petals(5, f[0], f[1], f[2] * 0.62, f[2] * 0.45, f[2] * 0.7, '#fff') + '<circle cx="' + f[0] + '" cy="' + f[1] + '" r="' + f[2] * 0.25 + '" fill="#ffe08a"/>'; });
      return svg(s);
    },
    cherry: function () {
      var s = '<path d="M8 78c10-6 14-20 20-34 4-9 10-18 20-24" stroke="#8a6b5d" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M26 50c6-1 10-4 14-10" stroke="#8a6b5d" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      [[44, 22, 9], [34, 44, 8], [18, 56, 7]].forEach(function (f) { s += petals(5, f[0], f[1], f[2] * 0.62, f[2] * 0.55, f[2] * 0.62, '#ffc2de') + '<circle cx="' + f[0] + '" cy="' + f[1] + '" r="' + f[2] * 0.22 + '" fill="#ff7eb6"/>'; });
      return svg(s);
    },
    firefly: function () {
      return svg('<path d="M8 80c2-10 4-16 6-22M16 80c0-8 2-14 4-20M46 80c-1-8-3-14-5-19M54 80c-2-10-4-14-7-20" stroke="#5fbf8a" stroke-width="2.2" stroke-linecap="round" fill="none"/><g class="glowfly"><circle cx="30" cy="34" r="16" fill="#ffe9a0" opacity=".28"/><circle cx="30" cy="34" r="8" fill="#ffe9a0" opacity=".45"/></g><ellipse cx="30" cy="34" rx="3.4" ry="5" fill="#ffd98e"/><ellipse cx="25" cy="30" rx="4" ry="2.2" fill="#fff" opacity=".7" transform="rotate(-30 25 30)"/><ellipse cx="35" cy="30" rx="4" ry="2.2" fill="#fff" opacity=".7" transform="rotate(30 35 30)"/>');
    },
    daisy: function () {
      return svg(STEM + LEAVES + petals(10, 30, 28, 11, 3.6, 8.5, '#fff') + '<circle cx="30" cy="28" r="6" fill="#ffd25e"/>');
    },
    sweetpea: function () {
      return svg('<path d="M30 80c0-14-2-24-8-34M30 66c0-12 4-22 12-30" stroke="#6fcf97" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 46c-10-2-14-12-8-20 8 0 12 8 8 20z" fill="#e3a8ff"/><path d="M22 46c-2-8 0-14 6-18 4 8 0 16-6 18z" fill="#f4cdff"/><path d="M42 36c-9-1-13-10-8-17 7 0 11 7 8 17z" fill="#ffb3d9"/><path d="M42 36c-2-7 0-12 5-15 3 7 0 13-5 15z" fill="#ffd9ec"/>');
    },
    moonflower: function () {
      return svg(STEM + LEAVES + '<circle cx="30" cy="28" r="22" fill="#e9e0ff" opacity=".22"/>' + petals(5, 30, 28, 11, 8, 12, '#fdfaff') + '<circle cx="30" cy="28" r="5" fill="#ffe9a0"/><path d="M48 8a6 6 0 1 1-5 9 5 5 0 0 0 5-9z" fill="#ffe9a0"/>');
    },
    crown: function () {
      return svg(STEM + LEAVES + '<circle cx="30" cy="28" r="24" fill="#ffd98e" opacity=".22"/>' + petals(8, 30, 28, 12, 4.8, 12, '#ffd25e') + petals(8, 30, 28, 8, 3.6, 7, '#fff0b8', 'transform-origin="center"') + '<circle cx="30" cy="28" r="5" fill="#ff7eb6"/><path d="M52 8l1.4 3.4 3.4 1.4-3.4 1.4L52 17.600l-1.400-3.400-3.400-1.400 3.400-1.400zM6 36l1 2.400 2.400 1-2.400 1L6 42.800l-1-2.400-2.400-1 2.400-1z" fill="#fff"/>');
    }
  };

  /* ---- EDIT HERE: the garden items, how they unlock and what they say ----
     id/art : which drawing to use
     name   : flower name
     hint   : what she needs to do to grow it
     msg    : message when tapped
     ok     : function(state) → true when it should be unlocked
  */
  function lettersAll() { return LW.state.letters.length >= (LW.LETTER_COUNT || 8); }
  var ITEMS = [
    { id: 'lavender', art: 'lavender', name: 'Lavender', hint: 'Finish the Love Memory Challenge', msg: 'Lavender, because it smells calm and looks like everything we love about purple. Being with you feels exactly like this.', ok: function () { return LW.isDone('memory'); } },
    { id: 'butterfly', art: 'butterfly', name: 'Butterfly', hint: 'Finish the Love Memory Challenge', msg: 'Every time I think of you, I feel a thousand butterflies, just like the very first day.', ok: function () { return LW.isDone('memory'); } },
    { id: 'rose', art: 'rose', name: 'Rose', hint: 'Finish the quiz', msg: 'A rose for the girl who knows exactly how to make me smile. (And who is going to win the stubborn contest every time.)', ok: function () { return LW.isDone('quiz'); } },
    { id: 'tulip', art: 'tulip', name: 'Tulip', hint: 'Open 3 mystery gifts', msg: 'A little tulip for the first few surprises. I have a lot more where these came from.', ok: function (s) { return s.boxes.length >= 3; } },
    { id: 'orchid', art: 'orchid', name: 'Orchid', hint: 'Open all 6 mystery gifts', msg: 'A rare orchid, because you are rare. The kind of person people only find once.', ok: function (s) { return s.boxes.length >= 6; } },
    { id: 'iris', art: 'iris', name: 'Iris', hint: 'Catch 15 points of hearts', msg: 'You have quick fingers and a kind heart. You catch mine every single time.', ok: function () { return LW.isDone('hearts'); } },
    { id: 'heartbloom', art: 'heartbloom', name: 'Heart Blossom', hint: 'Score 40+ in Catch the Hearts', msg: 'This one only grows for people who really love hearts. I think that might be you. Or it might be me. Maybe both.', ok: function (s) { return (s.bestHearts || 0) >= 40; } },
    { id: 'lantern', art: 'lantern', name: 'Little Lantern', hint: 'Read 3 secret letters', msg: 'A little light for the nights we miss each other the most. I always keep one on for you.', ok: function (s) { return s.letters.length >= 3; } },
    { id: 'jasmine', art: 'jasmine', name: 'Jasmine', hint: 'Read all the secret letters', msg: 'Soft, sweet and gentle, which is a little like you. Thank you for letting me love you.', ok: lettersAll },
    { id: 'cherry', art: 'cherry', name: 'Cherry Blossom', hint: 'Send a virtual hug', msg: 'Blossoms are for the moments that are short and beautiful. Our hugs are the same, and I want to keep making more of them.', ok: function () { return LW.isDone('hug'); } },
    { id: 'firefly', art: 'firefly', name: 'Firefly', hint: 'Visit "Distance Doesn\'t Matter"', msg: 'Even when it is dark and far, there is a tiny light travelling from Kandy to Kalutara just for you.', ok: function () { return LW.isDone('distance'); } },
    { id: 'daisy', art: 'daisy', name: 'Daisy', hint: 'Open today\'s little surprise', msg: 'A simple flower for a simple truth: you make my ordinary days feel special.', ok: function () { return LW.isDone('daily'); } },
    { id: 'sweetpea', art: 'sweetpea', name: 'Sweet Pea', hint: 'Open the daily surprise on 3 different days', msg: 'You came back, and you keep coming back. That is the best thing a flower (and a boyfriend) could ask for.', ok: function (s) { return (s.dailyDays || 0) >= 3; } },
    { id: 'moonflower', art: 'moonflower', name: 'Moonflower', hint: 'Add a photo to "Our Memories"', msg: 'It only opens at night, just like me waiting to talk to you. Every picture of us is my favourite thing on my phone.', ok: function (s) { return s.photos.length >= 1; } },
    { id: 'crown', art: 'crown', name: 'The Golden Flower', hint: 'Read the special letter', msg: 'The last flower to bloom, and the one that was always for you. Thirandee, you are my favourite person in the world.', ok: function (s) { return !!s.finalSeen; } }
  ];

  var scene;

  function seedArt() {
    return svg('<ellipse cx="30" cy="74" rx="16" ry="5" fill="#6b4a3a"/><path d="M30 72V62" stroke="#7fd6a0" stroke-width="2" stroke-linecap="round"/><path d="M30 64c-5 0-7-3-7-5 4 0 7 2 7 5z" fill="#7fd6a0"/>');
  }

  function render() {
    var seen = LW.state.gardenSeen || [];
    scene.innerHTML = '';
    ITEMS.forEach(function (it) {
      var unlocked = LW.state.garden.indexOf(it.id) !== -1;
      var plot = document.createElement('div');
      plot.className = 'plot ' + (unlocked ? 'grown' : 'locked') + (unlocked && seen.indexOf(it.id) === -1 ? ' fresh' : '');
      plot.innerHTML = (unlocked ? ART[it.art]() : seedArt()) + '<button aria-label="' + (unlocked ? it.name : 'Locked') + '"></button>';
      plot.querySelector('button').addEventListener('click', function () { show(it, unlocked); });
      scene.appendChild(plot);
    });
    LW.state.gardenSeen = LW.state.garden.slice(); LW.save();
    LW.$('#garden-count').textContent = LW.state.garden.length;
    LW.$('#screen-garden .stat-row').innerHTML = '<span><b id="garden-count">' + LW.state.garden.length + '</b> / ' + ITEMS.length + ' grown</span>';
  }

  function show(it, unlocked) {
    LW.chime(unlocked ? 'open' : 'wrong');
    var html;
    if (unlocked) {
      html = '<div class="m-icon" style="width:96px;height:96px">' + ART[it.art]() + '</div><h3 class="m-title">' + it.name + '</h3><p class="m-hand">' + it.msg + '</p><button class="m-btn" data-close>Lovely</button>';
    } else {
      html = '<div class="m-icon">' + seedArt() + '</div><h3 class="m-title">A seed is sleeping here</h3><p class="m-body" style="text-align:center">It grows when you:<br><b>' + it.hint + '</b></p><button class="m-btn" data-close>Okay!</button>';
    }
    LW.modal(html);
  }

  /* Checks everything against her progress and grows what's newly earned. */
  function sync(silent) {
    var added = [];
    ITEMS.forEach(function (it) {
      if (LW.state.garden.indexOf(it.id) === -1 && it.ok(LW.state)) { LW.state.garden.push(it.id); added.push(it.name); }
    });
    if (added.length) {
      LW.save();
      if (!silent) setTimeout(function () { LW.toast('New in your garden: ' + added.join(', ')); }, 700);
    }
  }

  LW.mods.garden = {
    init: function () { scene = LW.$('#garden-scene'); scene.style.gridTemplateColumns = 'repeat(3, 1fr)'; },
    enter: function () {
      sync(true); render();
      var n = LW.state.garden.length;
      LW.$('#garden-lead').textContent = n === 0 ? 'Nothing has grown yet. Go and play, and this place will bloom.' :
        n >= ITEMS.length ? 'Look at that. A whole garden, grown from us.' : 'Everything you discover grows something here.';
    },
    sync: sync
  };
})();
