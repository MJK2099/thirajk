/* =========================================================
   quiz.js — B. How Well Do You Know Us?
   Each question has options. `janaka` is the index of what
   Janaka would really answer — change it to match YOUR truth.
   Every option also has its own playful reply.
   ========================================================= */
(function () {
  'use strict';

  /* ---- EDIT HERE: questions, honest answers and replies ----
     q       : the question
     opts    : answer choices
     janaka  : index (starting at 0) of Janaka's real answer
     replies : one reply per option (shown after she taps it)
  */
  var QUESTIONS = [
    {
      q: 'Who is more romantic?',
      opts: ['Janaka', 'Thirandee', 'Both, equally'],
      janaka: 0,
      replies: [
        'Correct. Obviously. I made you an entire game.',
        'Aww, you\'re too sweet. But you don\'t get to win this one. I did build a whole world for you.',
        'Diplomatic. I love it. (But it\'s me.)'
      ]
    },
    {
      q: 'Who misses the other more?',
      opts: ['Janaka', 'Thirandee', 'We\'d both lose this contest'],
      janaka: 2,
      replies: [
        'Hmm, are you sure? I think you miss me a lot too.',
        'Maybe you do... but I count the days, so it\'s hard to say.',
        'Exactly. The distance is just bad at its job.'
      ]
    },
    {
      q: 'Who is more stubborn?',
      opts: ['Janaka', 'Thirandee', 'Both. We\'re a disaster.'],
      janaka: 2,
      replies: [
        'Hehe, you said it yourself, not me.',
        'Oh my. I\'m not touching that one. I like being alive.',
        'The most honest answer here. Two stubborn hearts, one stubborn love.'
      ]
    },
    {
      q: 'Who would apologise first after a fight?',
      opts: ['Janaka', 'Thirandee', 'Whoever misses the other first'],
      janaka: 2,
      replies: [
        'I\'d rather say sorry quickly than sleep angry. Good guess.',
        'You\'d say sorry? You? Stop. I\'ll say it first, I promise.',
        'And that never takes more than five minutes, does it?'
      ]
    },
    {
      q: 'What is our favourite colour?',
      opts: ['Purple', 'Pink', 'Blue', 'Green'],
      janaka: 0,
      replies: [
        'Purple, of course! You know us so well. Look around you, it\'s everywhere.',
        'Pink is lovely, but we\'re a purple couple.',
        'Blue is nice, but purple is ours.',
        'Green? Cute, but the answer is purple.'
      ]
    },
    {
      q: 'Who wants more hugs?',
      opts: ['Janaka', 'Thirandee', 'Both, and a lot more than we get'],
      janaka: 2,
      replies: [
        'Yes. I\'m waiting for the day I can hug you for real.',
        'I\'ll make up for it. Every single one, with interest.',
        'Exactly. The hug bank is empty and I need to make a very big deposit.'
      ]
    },
    {
      q: 'Which one would we choose together?',
      opts: ['A big feast', 'Something sweet', 'Both, then sleep'],
      janaka: 1,
      replies: [
        'Tempting, but we both know dessert wins.',
        'Sweet things, always. You taught me that.',
        'Honestly, that is also the correct plan.'
      ]
    },
    {
      q: 'Who sends the longer messages?',
      opts: ['Janaka', 'Thirandee', 'It depends who is missing whom'],
      janaka: 2,
      replies: [
        'Hmm, I might be guilty of this.',
        'Your messages are my favourite part of the day.',
        'Fair. It gets very long on the days we miss each other most.'
      ]
    }
  ];

  /* ---- EDIT HERE: results depend on how many she matched ---- */
  function result(score, total) {
    var r = score / total;
    if (r === 1) return { title: 'Perfect. Basically my other half', msg: 'You got every single one. You don\'t just know us, you ARE us. I have nothing left to teach you.' };
    if (r >= 0.7) return { title: 'Impressive, my love', msg: 'You know me very well. A few little surprises left, which gives me a reason to keep telling you things.' };
    if (r >= 0.4) return { title: 'Not bad at all', msg: 'You got some of them right and some wrong, which means I get to keep surprising you. I\'ll take it.' };
    return { title: 'Hmm, we need more talking', msg: 'Okay, that means we need a very long call tonight to catch you up. Starting now?' };
  }

  var body, idx = 0, score = 0, answered = false;

  function renderQuestion() {
    var q = QUESTIONS[idx]; answered = false;
    body.innerHTML = '<div class="quiz-card glass">' +
      '<p class="quiz-step">Question ' + (idx + 1) + ' of ' + QUESTIONS.length + '</p>' +
      '<h3 class="quiz-q">' + q.q + '</h3>' +
      '<div class="quiz-opts">' + q.opts.map(function (o, i) { return '<button class="quiz-opt" data-i="' + i + '">' + o + '</button>'; }).join('') + '</div>' +
      '<p class="quiz-reply" id="quiz-reply"></p>' +
      '<button class="btn-primary quiz-next" id="quiz-next" style="display:none">' + (idx === QUESTIONS.length - 1 ? 'See my result' : 'Next') + '</button>' +
      '</div>';
    LW.$$('.quiz-opt', body).forEach(function (b) { b.addEventListener('click', function () { answer(b); }); });
    LW.$('#quiz-next', body).addEventListener('click', function () { LW.chime(); idx++; if (idx < QUESTIONS.length) renderQuestion(); else showResult(); });
  }

  function answer(btn) {
    if (answered) return; answered = true;
    var q = QUESTIONS[idx], pick = +btn.dataset.i, right = pick === q.janaka;
    if (right) { score++; LW.chime('open'); LW.sparkleEl(btn, 10); } else { LW.chime('wrong'); }
    LW.$$('.quiz-opt', body).forEach(function (b) {
      b.disabled = true;
      if (+b.dataset.i === q.janaka) b.classList.add('right');
    });
    btn.classList.add('picked');
    LW.$('#quiz-reply', body).textContent = q.replies[pick];
    LW.$('#quiz-next', body).style.display = 'block';
  }

  function showResult() {
    var r = result(score, QUESTIONS.length);
    LW.state.quizBest = Math.max(LW.state.quizBest || 0, score);
    var first = LW.complete('quiz');
    LW.chime('win');
    body.innerHTML = '<div class="quiz-card glass quiz-result">' +
      '<p class="quiz-step">Your result</p>' +
      '<div class="big">' + score + ' / ' + QUESTIONS.length + '</div>' +
      '<h3>' + r.title + '</h3><p>' + r.msg + '</p>' +
      (first ? '<p style="color:#ffd1ea">A rose just bloomed in your garden.</p>' : '') +
      '<button class="btn-primary" id="quiz-again">Play again</button></div>';
    LW.$('#quiz-again', body).addEventListener('click', start);
    LW.sparkleAt(window.innerWidth / 2, 200, 20);
  }

  function start() { idx = 0; score = 0; renderQuestion(); }

  LW.mods.quiz = {
    init: function () { body = LW.$('#quiz-body'); start(); },
    enter: function () { /* continues where she left off */ }
  };
})();
