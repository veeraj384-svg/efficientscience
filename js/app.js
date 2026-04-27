/* =========================================================
   EfficientScience – Main Application Logic
   ========================================================= */

// ── Starfield Canvas ──────────────────────────────────────
function initStars() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const opacity = s.o * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

// ── Scroll-triggered nav ─────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Reveal on scroll ──────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

// ── Animated Counters ────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const step = 16;
  let current = 0;
  const inc = target / (dur / step);
  const timer = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

// ── Interactive demo question (landing page) ─────────────
function initDemoQuestion() {
  const opts = document.querySelectorAll('.qm-opt');
  const exp  = document.querySelector('.qm-explanation');
  if (!opts.length) return;
  const correct = 1; // index of correct answer for demo
  opts.forEach((opt, i) => {
    opt.addEventListener('click', () => {
      if (document.querySelector('.qm-opt.correct')) return;
      opts.forEach(o => o.style.pointerEvents = 'none');
      opt.classList.add(i === correct ? 'correct' : 'wrong');
      if (i !== correct) opts[correct].classList.add('correct');
      if (exp) exp.classList.add('show');
    });
  });
}

// ── Mobile nav toggle ────────────────────────────────────
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// ═══════════════════════════════════════════════════════════
//  PRACTICE PAGE ENGINE
// ═══════════════════════════════════════════════════════════
const PracticeEngine = (() => {
  let currentSubject = 'all';
  let currentDiff    = 'all';
  let currentGrade   = 'all';
  let queue          = [];
  let idx            = 0;
  let answered       = false;
  let score          = 0;
  let correct        = 0;
  let incorrect      = 0;
  let timerInterval  = null;
  let secondsLeft    = 90;

  const TOTAL_Q = 10;

  // Session stats from localStorage
  function loadStats() {
    return JSON.parse(localStorage.getItem('sciStats') || '{"total":0,"correct":0,"streak":0,"maxStreak":0}');
  }
  function saveStats(s) { localStorage.setItem('sciStats', JSON.stringify(s)); }

  function getFiltered() {
    return PROBLEMS.filter(p =>
      (currentSubject === 'all' || p.subject === currentSubject) &&
      (currentDiff    === 'all' || p.difficulty === currentDiff) &&
      (currentGrade   === 'all' || p.grade === currentGrade)
    );
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue() {
    const pool = shuffle(getFiltered());
    queue = pool.slice(0, TOTAL_Q);
    idx = 0; score = 0; correct = 0; incorrect = 0;
  }

  function render() {
    if (!queue.length) {
      document.getElementById('quiz-empty').style.display = 'block';
      document.getElementById('quiz-card').style.display  = 'none';
      return;
    }
    document.getElementById('quiz-empty').style.display = 'none';
    document.getElementById('quiz-card').style.display  = 'block';

    const p = queue[idx];
    const total = queue.length;

    // progress bar
    const pct = (idx / total) * 100;
    document.getElementById('quiz-progress-bar').style.width = pct + '%';
    document.getElementById('quiz-progress-text').textContent = `Question ${idx + 1} of ${total}`;

    // meta tags
    const subTag  = document.getElementById('quiz-subject-tag');
    const diffTag = document.getElementById('quiz-diff-tag');
    subTag.textContent  = p.subject;
    subTag.className = `tag tag-${p.subject.toLowerCase().replace(' ','')}`;
    diffTag.textContent = p.difficulty;
    diffTag.className = `tag tag-${p.difficulty.toLowerCase()}`;

    document.getElementById('quiz-num').textContent   = `#${p.id}  ·  ${p.topic}`;
    document.getElementById('quiz-question').textContent = p.question;

    // options
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    p.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.innerHTML = `<span class="opt-badge">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => handleAnswer(i));
      container.appendChild(btn);
    });

    // explanation
    const expBox = document.getElementById('quiz-explanation');
    expBox.classList.remove('show');
    expBox.querySelector('p').textContent = p.explanation;

    // next button
    document.getElementById('btn-next').textContent = (idx === total - 1) ? 'Finish Quiz' : 'Next Question →';
    document.getElementById('btn-next').style.display = 'none';

    answered = false;
    resetTimer();
    updateSidebarStats();
  }

  function handleAnswer(i) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const p = queue[idx];
    const opts = document.querySelectorAll('.quiz-opt');
    opts.forEach(o => o.disabled = true);
    opts[i].classList.add(i === p.answer ? 'correct' : 'wrong');
    if (i !== p.answer) opts[p.answer].classList.add('correct');

    document.getElementById('quiz-explanation').classList.add('show');
    document.getElementById('btn-next').style.display = 'inline-flex';

    const stats = loadStats();
    stats.total++;
    if (i === p.answer) {
      correct++;
      score += difficultyPoints(p.difficulty);
      stats.correct++;
      stats.streak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    } else {
      incorrect++;
      stats.streak = 0;
    }
    saveStats(stats);
    updateSidebarStats();
  }

  function difficultyPoints(d) {
    return { Easy: 10, Medium: 20, Hard: 30, Olympiad: 50 }[d] || 10;
  }

  function nextQuestion() {
    idx++;
    if (idx >= queue.length) { showSummary(); return; }
    render();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    secondsLeft = 90;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      secondsLeft--;
      updateTimerDisplay();
      if (secondsLeft <= 0) { clearInterval(timerInterval); handleAnswer(-1); }
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = document.getElementById('timer-display');
    if (!el) return;
    const m = Math.floor(secondsLeft / 60);
    const s = String(secondsLeft % 60).padStart(2, '0');
    el.textContent = `⏱ ${m}:${s}`;
    el.className = 'timer-display' + (secondsLeft <= 10 ? ' danger' : secondsLeft <= 30 ? ' warning' : '');
  }

  function showSummary() {
    clearInterval(timerInterval);
    const total = queue.length;
    const pct   = Math.round((correct / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚';

    document.getElementById('modal-emoji').textContent = emoji;
    document.getElementById('modal-score-text').textContent = pct + '%';
    document.getElementById('modal-correct').textContent   = correct;
    document.getElementById('modal-incorrect').textContent = incorrect;
    document.getElementById('modal-score-pts').textContent = score;

    // animate ring
    const circumference = 2 * Math.PI * 52;
    const ring = document.getElementById('score-ring-val');
    ring.setAttribute('stroke-dasharray', circumference);
    ring.setAttribute('stroke-dashoffset', circumference);
    setTimeout(() => {
      ring.setAttribute('stroke-dashoffset', circumference * (1 - pct / 100));
    }, 200);

    document.getElementById('score-modal').classList.add('show');
    document.getElementById('quiz-progress-bar').style.width = '100%';
  }

  function updateSidebarStats() {
    const s = loadStats();
    const el = id => document.getElementById(id);
    if (el('ss-total'))  el('ss-total').textContent  = s.total;
    if (el('ss-correct'))el('ss-correct').textContent= s.correct;
    if (el('ss-streak')) el('ss-streak').textContent = s.streak + ' 🔥';
    if (el('ss-acc'))    el('ss-acc').textContent    = s.total ? Math.round(s.correct/s.total*100)+'%' : '—';
  }

  function applyFilters() {
    buildQueue();
    render();
  }

  function updateDiffGuide() {
    const guide = document.getElementById('diff-guide');
    if (!guide) return;
    const emap = {
      'Elementary':   '<div>🟢 <strong style="color:var(--green)">Easy</strong> · 10 pts · Grades 3–5 level</div>',
      'Middle':       '<div>🟢 <strong style="color:var(--green)">Easy</strong> · 10 pts · Foundational</div><div>🟡 <strong style="color:var(--amber)">Medium</strong> · 20 pts · Applied concepts</div>',
      'High School':  '<div>🟢 <strong style="color:var(--green)">Easy</strong> · 10 pts · High school core</div><div>🟡 <strong style="color:var(--amber)">Medium</strong> · 20 pts · AP / A-level</div><div>🔴 <strong style="color:var(--rose)">Hard</strong> · 30 pts · National olympiad</div><div>🟣 <strong style="color:var(--purple)">Olympiad</strong> · 50 pts · IPhO/IChO/IBO</div>',
      'all':          '<div>🟢 <strong style="color:var(--green)">Easy</strong> · 10 pts</div><div>🟡 <strong style="color:var(--amber)">Medium</strong> · 20 pts</div><div>🔴 <strong style="color:var(--rose)">Hard</strong> · 30 pts</div><div>🟣 <strong style="color:var(--purple)">Olympiad</strong> · 50 pts</div>'
    };
    guide.innerHTML = emap[currentGrade] || emap['all'];
  }

  function init() {
    if (!document.getElementById('quiz-card')) return;

    // Grade level filters
    document.querySelectorAll('.grade-pill[data-grade]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.grade-pill[data-grade]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentGrade = pill.dataset.grade;
        // Reset difficulty when switching grades to avoid empty results
        currentDiff = 'all';
        document.querySelectorAll('.diff-pill[data-diff]').forEach(p => p.classList.remove('active'));
        document.querySelector('.diff-pill[data-diff="all"]').classList.add('active');
        applyFilters();
        updateDiffGuide();
      });
    });

    // Subject filters
    document.querySelectorAll('.filter-pill[data-subject]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill[data-subject]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentSubject = pill.dataset.subject;
        applyFilters();
      });
    });

    // Difficulty filters
    document.querySelectorAll('.diff-pill[data-diff]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.diff-pill[data-diff]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentDiff = pill.dataset.diff;
        applyFilters();
      });
    });

    // Next button
    document.getElementById('btn-next').addEventListener('click', nextQuestion);

    // Modal buttons
    document.getElementById('btn-restart').addEventListener('click', () => {
      document.getElementById('score-modal').classList.remove('show');
      buildQueue(); render();
    });
    document.getElementById('btn-home').addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    // Apply URL params
    const params = new URLSearchParams(window.location.search);
    const gParam = params.get('grade');
    const sParam = params.get('subject');
    const dParam = params.get('diff');
    if (gParam) {
      const gpill = document.querySelector(`.grade-pill[data-grade="${gParam}"]`);
      if (gpill) { document.querySelector('.grade-pill[data-grade="all"]').classList.remove('active'); gpill.classList.add('active'); currentGrade = gParam; updateDiffGuide(); }
    }
    if (sParam) {
      const spill = document.querySelector(`.filter-pill[data-subject="${sParam}"]`);
      if (spill) { document.querySelector('.filter-pill[data-subject="all"]').classList.remove('active'); spill.classList.add('active'); currentSubject = sParam; }
    }
    if (dParam) {
      const dpill = document.querySelector(`.diff-pill[data-diff="${dParam}"]`);
      if (dpill) { document.querySelector('.diff-pill[data-diff="all"]').classList.remove('active'); dpill.classList.add('active'); currentDiff = dParam; }
    }

    buildQueue();
    render();
    updateSidebarStats();
    updateDiffGuide();
  }

  return { init };
})();

// ── Boot ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initNav();
  initReveal();
  initCounters();
  initDemoQuestion();
  initMobileNav();
  PracticeEngine.init();
});
