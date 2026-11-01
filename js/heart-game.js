/* =========================================================
   heart-game.js — D. Catch the Hearts
   Canvas game: touch (or slide a finger over) falling hearts.
   30 seconds. Pink = 1, Purple = 2, Golden = 5.
   Scoring 15+ completes the activity.
   ========================================================= */
(function () {
  'use strict';

  var DURATION = 30;      // seconds
  var GOAL = 15;          // score needed to "complete" the activity

  /* ---- EDIT HERE: end-of-game messages by score ---- */
  function endMessage(score) {
    if (score >= 60) return 'Wow. You caught my entire heart and then some. (It was already yours anyway.)';
    if (score >= 35) return 'You are so fast! You catch my heart every single time.';
    if (score >= GOAL) return 'You did it! And you\'re officially the best heart-catcher in Sri Lanka.';
    return 'So close! Go again, I\'ll keep throwing hearts at you all day.';
  }

  var TYPES = [
    { name: 'pink',   color: '#ff8fc4', glow: 'rgba(255,143,196,.7)', pts: 1, w: 0.62, speed: 1.0 },
    { name: 'purple', color: '#b58cff', glow: 'rgba(181,140,255,.7)', pts: 2, w: 0.30, speed: 1.25 },
    { name: 'gold',   color: '#ffd98e', glow: 'rgba(255,217,142,.95)', pts: 5, w: 0.08, speed: 1.6 }
  ];

  var canvas, ctx, overlay, W = 0, H = 0, dpr = 1;
  var hearts = [], bits = [], pops = [];
  var playing = false, score = 0, timeLeft = DURATION, startAt = 0, lastT = 0, lastSpawn = 0, raf = 0, pressed = false;

  function resize() {
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pickType() {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < TYPES.length; i++) { acc += TYPES[i].w; if (r <= acc) return TYPES[i]; }
    return TYPES[0];
  }

  function spawn() {
    var t = pickType(), r = LW.rand(18, 28) * (t.name === 'gold' ? 0.9 : 1);
    hearts.push({
      x: LW.rand(r + 4, W - r - 4), y: -r, r: r, t: t,
      vy: LW.rand(70, 110) * t.speed * (1 + (DURATION - timeLeft) / 60), // gets slightly faster over time
      phase: Math.random() * 6.28, sway: LW.rand(8, 22), rot: LW.rand(-0.3, 0.3)
    });
  }

  // Path for a nice rounded heart centred on (0,0) with "radius" r
  function heartPath(c, r) {
    c.beginPath();
    c.moveTo(0, r * 0.85);
    c.bezierCurveTo(-r * 1.6, -r * 0.1, -r * 0.8, -r * 1.2, 0, -r * 0.45);
    c.bezierCurveTo(r * 0.8, -r * 1.2, r * 1.6, -r * 0.1, 0, r * 0.85);
    c.closePath();
  }

  function drawHeart(h, now) {
    ctx.save();
    ctx.translate(h.x + Math.sin(now / 600 + h.phase) * h.sway * 0.4, h.y);
    ctx.rotate(h.rot + Math.sin(now / 500 + h.phase) * 0.12);
    ctx.shadowColor = h.t.glow; ctx.shadowBlur = h.t.name === 'gold' ? 22 : 12;
    heartPath(ctx, h.r);
    ctx.fillStyle = h.t.color; ctx.fill();
    ctx.shadowBlur = 0;
    // little highlight so they feel glossy
    ctx.beginPath(); ctx.ellipse(-h.r * 0.5, -h.r * 0.35, h.r * 0.25, h.r * 0.14, -0.6, 0, 6.28);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
    ctx.restore();
  }

  function burst(h) {
    for (var i = 0; i < 7; i++) {
      var a = Math.random() * 6.28, s = LW.rand(40, 120);
      bits.push({ x: h.x, y: h.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, life: 0.7, color: h.t.color, r: LW.rand(2, 4) });
    }
    pops.push({ x: h.x, y: h.y, text: '+' + h.t.pts, life: 0.8, color: h.t.name === 'gold' ? '#ffe9b5' : '#fff' });
  }

  function catchAt(px, py) {
    for (var i = hearts.length - 1; i >= 0; i--) {
      var h = hearts[i], dx = px - h.x, dy = py - h.y;
      if (dx * dx + dy * dy < (h.r * 1.5) * (h.r * 1.5)) {   // generous hit area for fingers
        score += h.t.pts; burst(h); hearts.splice(i, 1);
        LW.$('#hg-score').textContent = score; LW.chime('catch');
        return;
      }
    }
  }

  function pointerPos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

  function frame(now) {
    if (!playing) return;
    var dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    timeLeft = Math.max(0, DURATION - (now - startAt) / 1000);
    LW.$('#hg-time').textContent = Math.ceil(timeLeft);

    // spawn rate: starts calm, gets busier
    var gap = 560 - (DURATION - timeLeft) * 7;
    if (now - lastSpawn > gap) { spawn(); lastSpawn = now; }

    ctx.clearRect(0, 0, W, H);
    // update + draw hearts
    for (var i = hearts.length - 1; i >= 0; i--) {
      var h = hearts[i]; h.y += h.vy * dt;
      if (h.y > H + h.r * 2) { hearts.splice(i, 1); continue; }
      drawHeart(h, now);
    }
    // sparkles
    for (var j = bits.length - 1; j >= 0; j--) {
      var b = bits[j]; b.life -= dt; if (b.life <= 0) { bits.splice(j, 1); continue; }
      b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 120 * dt;
      ctx.globalAlpha = Math.max(0, b.life / 0.7); ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // floating +points
    ctx.font = '700 20px Nunito, sans-serif'; ctx.textAlign = 'center';
    for (var k = pops.length - 1; k >= 0; k--) {
      var p = pops[k]; p.life -= dt; if (p.life <= 0) { pops.splice(k, 1); continue; }
      p.y -= 40 * dt; ctx.globalAlpha = Math.max(0, p.life / 0.8); ctx.fillStyle = p.color; ctx.fillText(p.text, p.x, p.y - 14);
    }
    ctx.globalAlpha = 1;

    if (timeLeft <= 0) { endGame(); return; }
    raf = requestAnimationFrame(frame);
  }

  function startGame() {
    resize();
    hearts = []; bits = []; pops = []; score = 0; timeLeft = DURATION;
    LW.$('#hg-score').textContent = '0'; LW.$('#hg-time').textContent = DURATION;
    overlay.classList.add('hidden'); playing = true;
    startAt = lastT = lastSpawn = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }

  function endGame() {
    playing = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H);
    var newBest = score > (LW.state.bestHearts || 0);
    if (newBest) LW.state.bestHearts = score;
    LW.$('#hg-best').textContent = LW.state.bestHearts;
    var firstTime = score >= GOAL ? LW.complete('hearts') : false;
    LW.touch(); // saves and updates the garden (best-score flowers)
    LW.chime(score >= GOAL ? 'win' : 'wrong');
    overlay.classList.remove('hidden');
    overlay.innerHTML = '<p class="overlay-title">' + score + ' points</p>' +
      '<p class="overlay-text">' + endMessage(score) + (newBest && score > 0 ? '<br><b style="color:#ffd98e">New best score!</b>' : '') +
      (firstTime ? '<br>An iris just bloomed in your garden.' : '') + '</p>' +
      '<button class="btn-primary" id="hg-start">Play again</button>';
    LW.$('#hg-start').addEventListener('click', startGame);
    if (score >= GOAL) LW.sparkleAt(window.innerWidth / 2, window.innerHeight / 2, 22);
  }

  LW.mods.hearts = {
    init: function () {
      canvas = LW.$('#hg-canvas'); ctx = canvas.getContext('2d'); overlay = LW.$('#hg-overlay');
      LW.$('#hg-best').textContent = LW.state.bestHearts || 0;
      LW.$('#hg-start').addEventListener('click', startGame);
      // Catch on touch, and also when sliding a finger across hearts
      canvas.addEventListener('pointerdown', function (e) { if (!playing) return; pressed = true; var p = pointerPos(e); catchAt(p.x, p.y); });
      canvas.addEventListener('pointermove', function (e) { if (!playing || !pressed) return; var p = pointerPos(e); catchAt(p.x, p.y); });
      window.addEventListener('pointerup', function () { pressed = false; });
      window.addEventListener('resize', function () { if (!playing && canvas.offsetParent) resize(); });
    },
    enter: function () { LW.$('#hg-best').textContent = LW.state.bestHearts || 0; setTimeout(resize, 50); },
    leave: function () {
      // Stop the game if she leaves the screen mid-round
      if (playing) {
        playing = false; cancelAnimationFrame(raf);
        overlay.classList.remove('hidden');
        overlay.innerHTML = '<p class="overlay-title">Catch the hearts</p><p class="overlay-text">Touch them with your finger before they fall.<br>Pink = 1 · Purple = 2 · Golden = 5</p><button class="btn-primary" id="hg-start">Start</button>';
        LW.$('#hg-start').addEventListener('click', startGame);
      }
    }
  };
})();
