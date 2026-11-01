/* =========================================================
   surprises.js — everything personal and heartfelt:
   C. Mystery Gifts        • Secret Letters       • Virtual Hug
   Distance Doesn't Matter • Our Memories (gallery)
   Daily Surprise          • The Special (final) Letter

   >>> This is the best file to edit to make it YOURS. <<<
   Every message below is written as an example in Janaka's
   voice. Change anything you like — just keep the quotes ("")
   and commas in place.
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     C. MYSTERY GIFTS  (EDIT the title and text of any box)
     colors: [box, lid, ribbon]
     ======================================================= */
  var GIFTS = [
    { id: 'g1', tag: 'Sweet', colors: ['#ff8fc4', '#ffb3d9', '#ffffff'], icon: 'heart', title: 'A sweet message',
      text: 'Thirandee, I don\'t say it enough in words, so I\'ll say it here. You are the softest, sweetest part of my life. Whenever a day gets heavy, I think of you and it gets lighter.' },
    { id: 'g2', tag: 'Hug', colors: ['#9b72e6', '#b794f6', '#ffe3f2'], icon: 'butterfly', title: 'A hug, delivered',
      text: '*walks across the entire country, wraps both arms around you and doesn\'t let go*\n\nNo hurry. Stay as long as you need. I\'ve got you.' },
    { id: 'g3', tag: 'Kiss', colors: ['#e0527f', '#ff7eb6', '#ffd1ea'], icon: 'heart', title: 'One kiss (plus two extra)',
      text: 'Mwah.\n\nOne on your forehead, one on your cheek, and one for the road. The rest you can collect in person, with interest.' },
    { id: 'g4', tag: 'Confession', colors: ['#7c4dcc', '#9b72e6', '#ffd98e'], icon: 'star', title: 'A funny confession',
      text: 'Confession: I smile at my phone like a complete fool whenever your name pops up. In public. In front of people. I pretend it\'s a funny video.\n\nIt is not a funny video. It\'s you.' },
    { id: 'g5', tag: 'Compliment', colors: ['#b794f6', '#cdb9ff', '#fff'], icon: 'flower', title: 'A compliment, with proof',
      text: 'You have the kind of smile that changes the colour of a room, and somehow a heart that is even prettier than that. I\'m still not sure how I got this lucky.' },
    { id: 'g6', tag: 'Letter', colors: ['#ffb3d9', '#ffd1ea', '#b794f6'], icon: 'moon', title: 'A tiny surprise letter',
      text: 'Dear Thirandee,\n\nIf you\'re reading this, you opened every box, and that makes me ridiculously happy.\n\nI hope this little world made you smile even once. That is all I wanted.\n\nP.S. There is one more letter waiting at the very end of this world. Keep exploring.\n\n— Janaka' }
  ];

  function giftSVG(c) {
    return '<svg viewBox="0 0 100 100"><rect x="14" y="46" width="72" height="46" rx="6" fill="' + c[0] + '"/><rect x="44" y="46" width="12" height="46" fill="' + c[2] + '"/>' +
      '<g class="lid"><rect x="8" y="32" width="84" height="18" rx="6" fill="' + c[1] + '"/><rect x="44" y="32" width="12" height="18" fill="' + c[2] + '"/>' +
      '<path d="M50 32C40 14 24 20 32 28c4 4 14 4 18 4zM50 32c10-18 26-12 18-4-4 4-14 4-18 4z" fill="' + c[2] + '"/></g></svg>';
  }
  function nl2br(t) { return t.split('\n\n').map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join(''); }

  var gifts = {
    init: function () {
      var grid = LW.$('#gift-grid');
      GIFTS.forEach(function (g) {
        var el = document.createElement('button');
        el.className = 'gift'; el.dataset.id = g.id;
        el.innerHTML = giftSVG(g.colors) + '<span class="tag">' + g.tag + '</span>';
        el.addEventListener('click', function () { openGift(el, g); });
        grid.appendChild(el);
      });
    },
    enter: function () { refreshGifts(); }
  };

  function refreshGifts() {
    LW.$$('.gift').forEach(function (el) { el.classList.toggle('open', LW.state.boxes.indexOf(el.dataset.id) !== -1); });
    LW.$('#gift-count').textContent = LW.state.boxes.length;
  }

  function openGift(el, g) {
    LW.chime('open'); el.classList.add('open'); LW.sparkleEl(el, 12);
    setTimeout(function () {
      var html = '<div class="m-icon" style="animation:heartBeat 1.6s ease-in-out infinite">' + LW.icon(g.icon) + '</div>' +
        '<h3 class="m-title">' + g.title + '</h3><div class="m-body">' + nl2br(g.text) + '</div><button class="m-btn" data-close>Thank you</button>';
      var isNew = LW.state.boxes.indexOf(g.id) === -1;
      if (isNew) LW.state.boxes.push(g.id);
      LW.modal(html, function () { refreshGifts(); });
      LW.touch(); refreshGifts();
      if (LW.state.boxes.length >= GIFTS.length) LW.complete('gifts');
    }, 650);
  }
  LW.mods.gifts = gifts;

  /* =======================================================
     SECRET LETTERS  (EDIT the words — one string per paragraph)
     kind decides the envelope colour: sweet | funny | emotional | reassuring
     ======================================================= */
  var LETTERS = [
    { id: 'l1', kind: 'sweet', label: 'Good morning', title: 'For when you wake up', body: [
      'Good morning, Thirandee.',
      'Before the day gets busy and the phone gets noisy, I want you to know that you were the first thing on my mind today. Not out of habit. Out of happiness.',
      'Drink something warm, take a deep breath, and walk into today like the beautiful, capable girl you are. I\'m cheering for you from Kandy, very loudly, even if you can\'t hear it.'
    ] },
    { id: 'l2', kind: 'emotional', label: 'When you miss me', title: 'Read this when you miss me', body: [
      'Some nights the distance feels bigger than it should. I know, because it feels that way for me too.',
      'But missing you is not a sad thing, not really. It\'s proof. It proves that what we have is real, and that I get to love someone so much that a few hours of road can\'t make it smaller.',
      'So close your eyes for a second. I\'m one call away, always, and always on your side.'
    ] },
    { id: 'l3', kind: 'funny', label: 'Official complaint', title: 'A formal complaint', body: [
      'To whom it may concern (the Distance Department):',
      'I wish to file a serious complaint against every kilometre between Kandy and Kalutara. They have been rude, inconvenient and generally unhelpful. They prevent me from hugging my girlfriend. I request they be removed immediately.',
      'Until this is resolved, I will continue to be dramatic and send very long messages as protest.',
      'Yours sincerely, A Very Serious Boyfriend.',
      'P.S. She is still prettier than any map.'
    ] },
    { id: 'l4', kind: 'reassuring', label: 'On a bad day', title: 'If today was a hard one', body: [
      'You don\'t have to be strong every single minute. You\'re allowed to be tired. You\'re allowed to be grumpy. You\'re even allowed to ignore me for a bit (I\'ll sulk quietly, I promise).',
      'Whatever you\'re working towards, I believe in you completely. Slow is still moving. Hard days still count.',
      'I\'m so proud of you, and I need you to hear that more often.'
    ] },
    { id: 'l5', kind: 'sweet', label: 'Why I\'m lucky', title: 'Why I\'m the lucky one', body: [
      'I love the way you laugh at things you pretend aren\'t funny.',
      'I love how kind you are to people who haven\'t earned it, how you care about doing things the proper, respectful way, and how your whole face lights up when someone says the word "dessert".',
      'There are a hundred more reasons. I\'m saving them so I never run out of things to tell you.'
    ] },
    { id: 'l6', kind: 'funny', label: 'Sweet-toothed girl', title: 'For my sweet-toothed girl', body: [
      'Breaking news: you are the only person in the world I would voluntarily share dessert with.',
      'The day we sit across the same table again, the first round is on me. Whatever sweet thing you want. And I am not allowed to take the last bite. That is the rule, and I am writing it down so I can\'t escape it later.',
      'P.S. If I could post a cake to you, I would have been bankrupt a long time ago.'
    ] },
    { id: 'l7', kind: 'emotional', label: 'My quiet days', title: 'On the days I go quiet', body: [
      'Sometimes I go quiet. Not because I love you less, but because my head is loud and I can\'t find the words.',
      'If that ever happens, please don\'t think it\'s about you. It never is. I always come back, and I always come back to you first.',
      'Thank you for being patient with me. It means more than I know how to say.'
    ] },
    { id: 'l8', kind: 'reassuring', label: 'Until I see you', title: 'Until I see you', body: [
      'I don\'t know exactly when the next time will be, but I know there will be one, and I\'m counting.',
      'This distance is temporary. What we\'re building is not. Every message, every call, every silly voice note is another brick in something I plan to keep for a very long time.',
      'One day I\'ll walk through a door and you\'ll be right there. Until then, hold on to me the way I\'m holding on to you.'
    ] }
  ];
  LW.LETTER_COUNT = LETTERS.length;

  var ENV_COLORS = { sweet: ['#ffd1ea', '#ffb3d9'], funny: ['#fff2c9', '#ffe08a'], emotional: ['#cdb9ff', '#b794f6'], reassuring: ['#e3f0ff', '#b9d5ff'] };

  function envSVG(kind) {
    var c = ENV_COLORS[kind] || ENV_COLORS.sweet;
    return '<svg viewBox="0 0 120 90"><rect x="4" y="14" width="112" height="72" rx="8" fill="' + c[0] + '"/>' +
      '<path d="M4 22l56 36 56-36" stroke="' + c[1] + '" stroke-width="2.5" fill="none"/>' +
      '<path class="flap" d="M4 18C4 14 7 12 11 14l49 34 49-34c4-2 7 0 7 4L60 56z" fill="' + c[1] + '"/>' +
      '<circle cx="60" cy="50" r="9" fill="#ff7eb6"/><path d="M60 56s-6-3.600-7.500-7.200c-.9-2.400.6-4.400 2.800-4.400 1.300 0 2.200.7 4.700 2.400 2.500-1.700 3.400-2.400 4.700-2.400 2.200 0 3.700 2 2.800 4.400C66 52.400 60 56 60 56z" fill="#fff"/></svg>';
  }

  var letters = {
    init: function () {
      var grid = LW.$('#letter-grid');
      LETTERS.forEach(function (l) {
        var el = document.createElement('button');
        el.className = 'env'; el.dataset.id = l.id;
        el.innerHTML = '<span class="badge">new</span>' + envSVG(l.kind) + '<span class="env-label">' + l.label + '</span>';
        el.addEventListener('click', function () { openLetter(el, l); });
        grid.appendChild(el);
      });
    },
    enter: function () { refreshLetters(); }
  };
  function refreshLetters() {
    LW.$$('.env').forEach(function (el) { el.classList.toggle('opened', LW.state.letters.indexOf(el.dataset.id) !== -1); el.classList.remove('opening'); });
  }
  function openLetter(el, l) {
    LW.chime('open'); el.classList.add('opening');
    setTimeout(function () {
      var html = '<div class="letter-slide"><h3 class="m-title">' + l.title + '</h3><div class="m-body">' +
        l.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div><p class="m-sign">— Janaka</p>' +
        '<button class="m-btn" data-close>Keep it close</button></div>';
      if (LW.state.letters.indexOf(l.id) === -1) LW.state.letters.push(l.id);
      LW.modal(html, refreshLetters);
      LW.touch(); refreshLetters(); el.classList.add('opened');
      if (LW.state.letters.length >= LETTERS.length) LW.complete('letters');
    }, 600);
  }
  LW.mods.letters = letters;

  /* =======================================================
     VIRTUAL HUG  (EDIT the messages that appear after the hug)
     ======================================================= */
  var HUG_MESSAGES = [
    'There. Wrapped up. Nothing can reach you right now.',
    'I wish this was real. I\'m working on it, I promise.',
    'This is me holding you tight, and not letting go until you smile.',
    'Close your eyes. Breathe in. I\'m right here.',
    'A hug from Kandy, delivered with all the love I have.'
  ];

  function character(cls, bodyColor, hair, cx, extra) {
    return '<g class="' + cls + '">' +
      '<ellipse cx="' + cx + '" cy="236" rx="30" ry="5" fill="rgba(0,0,0,.18)"/>' +
      '<rect x="' + (cx - 25) + '" y="130" width="50" height="100" rx="24" fill="' + bodyColor + '"/>' +
      '<circle cx="' + cx + '" cy="102" r="31" fill="#f6d5c0"/>' + hair +
      '<circle cx="' + (cx - 11) + '" cy="104" r="2.800" fill="#3a2160"/><circle cx="' + (cx + 11) + '" cy="104" r="2.800" fill="#3a2160"/>' +
      '<circle cx="' + (cx - 18) + '" cy="113" r="5" fill="#ffb3d9" opacity=".7"/><circle cx="' + (cx + 18) + '" cy="113" r="5" fill="#ffb3d9" opacity=".7"/>' +
      '<path d="M' + (cx - 6) + ' 114q6 6 12 0" stroke="#3a2160" stroke-width="2.200" fill="none" stroke-linecap="round"/>' + (extra || '') + '</g>';
  }

  var hug = {
    init: function () {
      var jHair = '<path d="M44 98c-2-22 12-36 31-36 20 0 34 14 31 36-6-12-14-18-31-18S50 86 44 98z" fill="#2b1a40"/>';
      var tHair = '<path d="M192 100c-4-26 12-42 33-42s37 16 33 42l2 44c0 6-6 6-8 0l-3-30c-8-8-14-24-24-24s-16 16-24 24l-3 30c-2 6-8 6-8 0z" fill="#2b1a40"/>';
      var clip = '<g transform="translate(252 86)"><circle r="2.500" cx="0" cy="-5" fill="#ff8fc4"/><circle r="2.500" cx="5" cy="0" fill="#ff8fc4"/><circle r="2.500" cx="0" cy="5" fill="#ff8fc4"/><circle r="2.500" cx="-5" cy="0" fill="#ff8fc4"/><circle r="2" fill="#ffd98e"/></g>';
      var arms = function (cls, color, x) { return '<g class="' + cls + '"><rect class="arm ' + (cls === 'who-l' ? 'arm-l' : 'arm-r') + '" x="' + x + '" y="138" width="15" height="58" rx="7.500" fill="' + color + '"/></g>'; };
      LW.$('#hug-stage').innerHTML = '<svg viewBox="0 0 300 260">' +
        '<g class="big-heart"><path d="M150 48S118 30 120 14c1-10 15-12 30-1 15-11 29-9 30 1 2 16-30 34-30 34z" fill="#ff7eb6"/></g>' +
        '<g class="breathe-slow">' + character('who-l', '#8a5fe0', jHair, 75) + character('who-r', '#ff8fc4', tHair, 225, clip) + '</g>' +
        arms('who-l', '#8a5fe0', 96) + arms('who-r', '#ff8fc4', 189) + '</svg>';
      LW.$('#hug-btn').addEventListener('click', doHug);
    },
    enter: function () { }
  };

  function doHug() {
    var stage = LW.$('#hug-stage'), btn = LW.$('#hug-btn'), msg = LW.$('#hug-message');
    btn.disabled = true; stage.classList.remove('hugging'); msg.textContent = '';
    LW.chime('open');
    setTimeout(function () { stage.classList.add('hugging'); }, 60);
    // Rising hearts while they hug
    for (var i = 0; i < 8; i++) setTimeout(function () {
      var r = stage.getBoundingClientRect(); LW.sparkleAt(r.left + r.width * LW.rand(0.3, 0.7), r.top + r.height * LW.rand(0.1, 0.5), 3);
    }, 1800 + i * 300);
    setTimeout(function () { msg.textContent = LW.pick(HUG_MESSAGES); LW.chime('win'); }, 2000);
    setTimeout(function () { btn.disabled = false; btn.textContent = 'Hug again'; LW.complete('hug'); }, 2600);
  }
  LW.mods.hug = hug;

  /* =======================================================
     DISTANCE DOESN'T MATTER  (EDIT the four messages)
     Not a real map: a stylised illustration of the island.
     ======================================================= */
  var DISTANCE_MESSAGES = [
    'Kandy and Kalutara are just names on a map. You are my home, wherever you are.',
    'The road between us is long, but my feelings for you never get stuck in traffic. They always arrive.',
    'I can\'t hold your hand today, so this little heart is doing it for me.',
    'Far apart in kilometres. Close in absolutely everything else.'
  ];

  // Rough outline of Sri Lanka as [longitude, latitude] pairs (artistic, not survey-accurate)
  var ISLAND = [[79.92, 9.78], [80.25, 9.82], [80.55, 9.55], [80.78, 9.1], [81.1, 8.55], [81.45, 8.1], [81.75, 7.55], [81.88, 7.05], [81.75, 6.6], [81.4, 6.25], [80.95, 6.05], [80.55, 5.95], [80.15, 6.05], [79.9, 6.4], [79.83, 7.0], [79.85, 7.55], [79.72, 8.05], [79.9, 8.55], [79.88, 9.1]];
  var KANDY = [80.633, 7.291], KALUTARA = [79.959, 6.585];

  function proj(p) { return [30 + (p[0] - 79.4) / 2.7 * 260, 30 + (10 - p[1]) / 4.2 * 390]; }

  var mapIdx = 0, sendDir = 0, mapBuilt = false;
  var distance = {
    init: function () {
      var pts = ISLAND.map(proj), k = proj(KANDY), t = proj(KALUTARA);
      var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + ' Z';
      var cx = (k[0] + t[0]) / 2 + 70, cy = (k[1] + t[1]) / 2 - 20;
      var route = 'M' + k[0].toFixed(1) + ' ' + k[1].toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + t[0].toFixed(1) + ' ' + t[1].toFixed(1);
      var routeBack = 'M' + t[0].toFixed(1) + ' ' + t[1].toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + k[0].toFixed(1) + ' ' + k[1].toFixed(1);
      var mid = [0.25 * k[0] + 0.5 * cx + 0.25 * t[0], 0.25 * k[1] + 0.5 * cy + 0.25 * t[1]];
      var heartD = 'M0 7C-13-2-6-12 0-5 6-12 13-2 0 7z';
      distance.routes = [route, routeBack]; distance.mid = mid;
      LW.$('#map-wrap').innerHTML = '<svg viewBox="0 0 320 450" id="map-svg">' +
        '<defs><linearGradient id="islandG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdb9ff" stop-opacity=".55"/><stop offset="1" stop-color="#ff9fd0" stop-opacity=".4"/></linearGradient>' +
        '<filter id="glowF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
        '<g fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-linecap="round"><path d="M14 40q10-8 20 0t20 0"/><path d="M270 420q10-8 20 0t20 0"/><path d="M12 300q10-8 20 0t20 0"/><path d="M262 60q10-8 20 0t20 0"/></g>' +
        '<path d="' + d + '" fill="url(#islandG)" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linejoin="round"/>' +
        '<path class="map-line" d="' + route + '" stroke="#ffb3d9" stroke-width="2.5" fill="none" stroke-linecap="round" filter="url(#glowF)"/>' +
        '<g><circle class="map-pulse" cx="' + k[0] + '" cy="' + k[1] + '" r="9" fill="#cdb9ff"/><circle cx="' + k[0] + '" cy="' + k[1] + '" r="7" fill="#fff"/><circle cx="' + k[0] + '" cy="' + k[1] + '" r="3.500" fill="#8a5fe0"/></g>' +
        '<g><circle class="map-pulse" cx="' + t[0] + '" cy="' + t[1] + '" r="9" fill="#ffb3d9" style="animation-delay:1s"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="7" fill="#fff"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="3.500" fill="#ff7eb6"/></g>' +
        '<text x="' + (k[0] + 14) + '" y="' + (k[1] - 6) + '" fill="#fff" font-family="Dancing Script, cursive" font-size="24" font-weight="700">Kandy</text>' +
        '<text x="' + (k[0] + 14) + '" y="' + (k[1] + 12) + '" fill="#cdb9ff" font-size="11">Janaka</text>' +
        '<text x="' + (t[0] + 4) + '" y="' + (t[1] + 28) + '" text-anchor="start" fill="#fff" font-family="Dancing Script, cursive" font-size="24" font-weight="700">Kalutara</text>' +
        '<text x="' + (t[0] + 4) + '" y="' + (t[1] + 44) + '" text-anchor="start" fill="#ffb3d9" font-size="11">Thirandee</text>' +
        '<g id="map-heart-btn" transform="translate(' + mid[0].toFixed(1) + ' ' + mid[1].toFixed(1) + ')" style="cursor:pointer"><circle r="22" fill="#ff7eb6" opacity=".25" filter="url(#glowF)"/><path class="map-heart" d="' + heartD + '" fill="#ff7eb6" transform="scale(1.9)" filter="url(#glowF)"/></g>' +
        '<g id="map-fly"></g></svg>';
      LW.$('#map-heart-btn').addEventListener('click', onMapHeart);
      LW.$('#map-send').addEventListener('click', sendHeart);
      mapBuilt = true;
    },
    enter: function () { }
  };

  function onMapHeart() {
    LW.chime('open');
    LW.$('#map-message').textContent = DISTANCE_MESSAGES[mapIdx % DISTANCE_MESSAGES.length]; mapIdx++;
    LW.sparkleEl(LW.$('#map-heart-btn'), 10);
    LW.complete('distance');
  }

  function sendHeart() {
    if (!mapBuilt) return;
    var fly = LW.$('#map-fly'), path = distance.routes[sendDir % 2];
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', 'M0 7C-13-2-6-12 0-5 6-12 13-2 0 7z'); el.setAttribute('fill', '#fff'); el.setAttribute('transform', 'scale(1.3)');
    var am = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    am.setAttribute('dur', '2.4s'); am.setAttribute('path', path); am.setAttribute('fill', 'freeze'); am.setAttribute('begin', 'indefinite');
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(el); g.appendChild(am); fly.appendChild(g);
    LW.chime(); if (am.beginElement) am.beginElement();
    LW.$('#map-message').textContent = sendDir % 2 === 0 ? 'A heart just left Kandy...' : 'And one coming back to Kandy...';
    var btn = LW.$('#map-send'); btn.disabled = true;
    var toKalutara = sendDir % 2 === 0; sendDir++;
    setTimeout(function () {
      g.remove(); btn.disabled = false;
      var r = LW.$('#map-svg').getBoundingClientRect(), tgt = toKalutara ? proj(KALUTARA) : proj(KANDY);
      LW.sparkleAt(r.left + tgt[0] / 320 * r.width, r.top + tgt[1] / 450 * r.height, 14); LW.chime('win');
      LW.$('#map-message').textContent = toKalutara ? 'Delivered to Kalutara. She\'s smiling, I can feel it.' : 'Received in Kandy. Best part of my day.';
      LW.complete('distance');
    }, 2500);
  }
  LW.mods.distance = distance;

  /* =======================================================
     OUR MEMORIES — photo gallery
     Two ways to add photos:
       1) PHOTOS below: drop files into assets/images/ with these names
       2) The "Add a photo" button: saves a resized copy on her phone
     ======================================================= */
  var PHOTOS = [
    // >>> CUSTOMISE: change the captions, or swap the files in assets/images/ (keep the names, or edit src) <<<
    // To show more photos, copy a line, e.g. photo5.jpg. Delete a line to hide a photo.
    { src: 'assets/images/photo1.jpg', cap: 'Thinking of you' },
    { src: 'assets/images/photo2.jpg', cap: 'Ciao ❤' },
    { src: 'assets/images/photo3.jpg', cap: 'That cheeky face' },
    { src: 'assets/images/photo4.jpg', cap: 'Always you' }
  ];

  function resizeImage(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = function () { cb(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  function renderGallery() {
    var grid = LW.$('#gallery-grid'); grid.innerHTML = '';
    function tile(src, cap, delIdx) {
      var p = document.createElement('div'); p.className = 'polaroid';
      var img = new Image(); img.loading = 'lazy'; img.alt = cap; img.src = src;
      img.onerror = function () {
        var ph = document.createElement('div'); ph.className = 'ph';
        ph.textContent = 'Your photo goes here: ' + src.split('/').pop(); img.replaceWith(ph);
      };
      img.addEventListener('click', function () { LW.chime(); LW.modal('<img src="' + src + '" alt="" style="width:100%;border-radius:12px"><p class="m-hand" style="margin-top:10px">' + cap + '</p>'); });
      p.appendChild(img);
      var c = document.createElement('div'); c.className = 'cap'; c.textContent = cap; p.appendChild(c);
      if (delIdx !== undefined) {
        var d = document.createElement('button'); d.className = 'del'; d.textContent = '×'; d.setAttribute('aria-label', 'Remove photo');
        d.addEventListener('click', function () { if (confirm('Remove this photo from the gallery?')) { LW.state.photos.splice(delIdx, 1); LW.touch(); renderGallery(); } });
        p.appendChild(d);
      }
      grid.appendChild(p);
    }
    PHOTOS.forEach(function (ph) { tile(ph.src, ph.cap); });
    LW.state.photos.forEach(function (ph, i) { tile(ph.src, ph.cap || 'Us', i); });
  }

  var gallery = {
    init: function () {
      LW.$('#gallery-input').addEventListener('change', function (e) {
        var files = Array.prototype.slice.call(e.target.files || []); e.target.value = '';
        var n = 0;
        (function next() {
          var f = files.shift(); if (!f) { renderGallery(); if (n) { LW.touch(); LW.toast(n + ' photo' + (n > 1 ? 's' : '') + ' added'); } return; }
          resizeImage(f, function (data) {
            if (data) {
              LW.state.photos.push({ src: data, cap: 'Us' });
              if (!LW.save()) { LW.state.photos.pop(); LW.toast('This phone\'s storage for the game is full. Remove a photo first.'); return renderGallery(); }
              n++;
            }
            next();
          });
        })();
        LW.chime('open');
      });
    },
    enter: function () { renderGallery(); }
  };
  LW.mods.gallery = gallery;

  /* =======================================================
     DAILY SURPRISE  (EDIT / ADD as many lines as you like)
     ======================================================= */
  var DAILY = [
    'You\'re the first person I want to tell everything to, good or bad.',
    'Today, I just wanted to remind you that someone in Kandy is very proud of you.',
    'I\'ll never get tired of hearing your voice. Not even on the days you\'re being stubborn.',
    'If I could send you one thing today, it would be a hug. So here it is: *hug*.',
    'You make ordinary days feel like they matter.',
    'Drink some water, eat something sweet, and know that I love you.',
    'Whatever happens today, you\'re not facing it alone.',
    'Your smile is my favourite notification.',
    'I fall for you a little more every time you laugh at your own jokes.',
    'Thank you for loving me on the days I\'m not easy to love.',
    'The distance is just a detail. You are the story.',
    'You are way too pretty to be this kind. It\'s unfair to everyone else.',
    'I hope today is gentle with you.',
    'Promise me you\'ll rest tonight. You deserve it.',
    'My favourite place in the world is wherever the call with you is.',
    'I am so, so lucky that I get to be yours.',
    'If today feels heavy, put it down for a minute and think of something sweet. Preferably dessert. Preferably with me.',
    'I\'m counting the days until I get to hold your hand again.',
    'You\'re my calm and my chaos, and I wouldn\'t trade either.',
    'Hey. Yes you. I love you.',
    'There\'s no one I\'d rather be silly with.',
    'I may be far away, but my thoughts are never far from you.',
    'You are enough. You\'ve always been enough. You\'re more than enough for me.',
    'Remember to smile today. I\'m probably smiling about you.',
    'You are doing better than you think.',
    'Some people look their whole lives for what I found in you.',
    'I\'m thinking of you. That\'s it. That\'s the whole message.',
    'Take a deep breath. Now another one. Now remember I love you.',
    'Good things are coming for you. I can feel it. And I plan to be there for every one of them.',
    'Be gentle with yourself today, my love.'
  ];

  function pickDaily() {
    var seen = LW.state.dailySeen || [];
    var pool = DAILY.map(function (_, i) { return i; }).filter(function (i) { return seen.indexOf(i) === -1; });
    if (!pool.length) { seen = []; pool = DAILY.map(function (_, i) { return i; }); }
    var i = LW.pick(pool); seen.push(i); LW.state.dailySeen = seen; return i;
  }

  function showDaily() {
    var today = LW.today();
    if (LW.state.lastDaily !== today) { LW.state.lastDaily = today; LW.state.dailyDays = (LW.state.dailyDays || 0) + 1; }
    var i = pickDaily(); LW.chime('open');
    var html = '<div class="m-icon">' + LW.icon('daily') + '</div><h3 class="m-title">Today\'s little surprise</h3>' +
      '<p class="m-hand">' + DAILY[i] + '</p>' +
      '<p class="m-sign">— Janaka</p>' +
      '<button class="m-btn" id="daily-again">Another one</button>';
    LW.modal(html);
    LW.$('#daily-again').addEventListener('click', function () { showDaily(); });
    var first = LW.complete('daily'); if (!first) LW.touch();
    LW.sparkleAt(window.innerWidth / 2, window.innerHeight / 2, 14);
  }
  LW.mods.daily = { open: showDaily };

  /* =======================================================
     THE SPECIAL LETTER — unlocks when all 8 things are discovered
     >>> Rewrite this in your own words. This is the most
         important message in the whole game. <<<
     ======================================================= */
  var FINAL = {
    title: 'For Thirandee, with all my heart',
    body: [
      'My dearest Thirandee,',
      'If you\'re reading this, you wandered through every corner of this little world I made. Thank you. I built it slowly, thinking of you the entire time, and I hoped that it would make you smile at least once.',
      'I wanted to give you something that feels the way you make me feel: warm, a little bit magical, and full of sweet surprises. Because that is exactly what you are to me.',
      'Loving someone from far away is not always easy. There are nights I wish I could just knock on your door, and days when a phone screen feels far too small to hold everything I want to say. But you have made every one of those days worth it. You are patient with me, kind to me, and you make me want to be better in ways I hadn\'t known I needed.',
      'I love the girl who laughs at her own jokes. I love the one who is a little traditional and does things the proper way, the one who lights up at anything sweet, and the one who cries a little when she\'s overwhelmed and then somehow gets up again. All of her. Every version.',
      'I don\'t have a perfect plan for the future, but I do know this: I want you in it. Every part of it. The easy days, the difficult ones, and the ordinary ones in between.',
      'Until I can hold you in person, this little world is here for you whenever you miss me. It will always be open. And so will I.',
      'I love you, Thirandee. Today, tomorrow, and all the days after.',
      'P.S. Come back every day. There is always a new surprise waiting.'
    ]
  };

  LW.mods.finalLetter = {
    open: function () {
      var html = '<div class="m-icon">' + LW.icon('seal') + '</div><h3 class="m-title">' + FINAL.title + '</h3>' +
        '<div class="m-body">' + FINAL.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
        '<p class="m-sign">Forever yours,<br>Janaka</p><button class="m-btn" data-close>I love you too</button>';
      var first = !LW.state.finalSeen;
      LW.modal(html, function () { if (first) LW.toast('The golden flower just bloomed in your garden'); });
      LW.state.finalSeen = true; LW.touch();
      LW.sparkleAt(window.innerWidth / 2, window.innerHeight / 3, 26);
    }
  };
})();
