/* =========================================================
   memory.js — A. Love Memory Challenge (card matching)
   6 pairs: heart, flower, candy, star, moon, butterfly.
   Finishing the game reveals a message from Janaka.
   ========================================================= */
(function () {
  'use strict';

  /* ---- EDIT HERE: the message she sees after winning ---- */
  var WIN_TITLE = 'You found every one of them';
  var WIN_MESSAGE = [
    'Thirandee, you matched every pair. And honestly, you have matched me in a hundred little ways without even trying.',
    'Out of everything in this world, I\'d still pick you every single time. A sweet face, a sweeter heart, and a smile that fixes my whole day.',
    'Thank you for being mine.'
  ];

  var SYMBOLS = ['heart', 'flower', 'candy', 'star', 'moon', 'butterfly'];
  var grid, movesEl, pairsEl;
  var first = null, lock = false, moves = 0, pairs = 0;

  function build() {
    grid.innerHTML = ''; first = null; lock = false; moves = 0; pairs = 0;
    movesEl.textContent = '0'; pairsEl.textContent = '0';
    // Two of each symbol, shuffled
    var deck = LW.shuffle(SYMBOLS.concat(SYMBOLS));
    deck.forEach(function (sym) {
      var c = document.createElement('div');
      c.className = 'mcard'; c.dataset.sym = sym;
      c.innerHTML = '<div class="face front"></div><div class="face rear">' + LW.icon(sym) + '</div>';
      c.addEventListener('click', function () { flip(c); });
      grid.appendChild(c);
    });
  }

  function flip(card) {
    if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped'); LW.chime();
    if (!first) { first = card; return; }

    moves++; movesEl.textContent = moves;
    var second = card;
    if (first.dataset.sym === second.dataset.sym) {
      // A match!
      var a = first, b = second; first = null;
      setTimeout(function () {
        a.classList.add('matched'); b.classList.add('matched');
        LW.sparkleEl(a, 8); LW.sparkleEl(b, 8); LW.chime('open');
        pairs++; pairsEl.textContent = pairs;
        if (pairs === SYMBOLS.length) setTimeout(win, 700);
      }, 450);
    } else {
      lock = true;
      var f = first; first = null;
      setTimeout(function () { f.classList.remove('flipped'); second.classList.remove('flipped'); lock = false; }, 900);
    }
  }

  function win() {
    LW.chime('win');
    var html = '<div class="m-icon">' + LW.icon('heart') + '</div>' +
      '<h3 class="m-title">' + WIN_TITLE + '</h3>' +
      '<div class="m-body">' + WIN_MESSAGE.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '<p class="m-sign">— Janaka</p>' +
      '<p class="m-body" style="text-align:center;font-size:.85rem;color:#7c4dcc">Finished in ' + moves + ' moves</p>' +
      '<button class="m-btn" data-close>Aww, thank you</button>';
    LW.complete('memory'); // also grows the lavender + butterfly in the garden
    LW.modal(html);
    LW.sparkleAt(window.innerWidth / 2, window.innerHeight / 2, 24);
  }

  LW.mods.memory = {
    init: function () {
      grid = LW.$('#memory-grid'); movesEl = LW.$('#mem-moves'); pairsEl = LW.$('#mem-pairs');
      LW.$('#mem-restart').addEventListener('click', function () { LW.chime(); build(); });
      build();
    },
    enter: function () { /* keep the current board so she can continue */ }
  };
})();
