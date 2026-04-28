/* =========================================================
   EfficientScience – Auth Module
   Fully client-side: localStorage DB + synchronous JS hash.
   No server, no Web Crypto API, works in every browser.
   ========================================================= */

// ── Password hashing (synchronous, no external APIs) ─────────
// 128-bit output using four parallel Murmur3-style streams.
function hashPw(pw) {
  const str = pw + ':effscience-2025';
  const s   = [0x9368e53c, 0xf262a48d, 0x3f27d81b, 0xc5a365e9];
  const p   = [0x9e3779b9, 0x517cc1b7, 0x27d4eb2f, 0x165667b1];

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    s[0] = (Math.imul(s[0] ^ c, p[0]) + (s[1] >>> 16)) >>> 0;
    s[1] = (Math.imul(s[1] ^ c, p[1]) + (s[2] >>> 16)) >>> 0;
    s[2] = (Math.imul(s[2] ^ c, p[2]) + (s[3] >>> 16)) >>> 0;
    s[3] = (Math.imul(s[3] ^ c, p[3]) + (s[0] >>> 16)) >>> 0;
  }
  // finalise
  for (let r = 0; r < 8; r++) {
    s[0] = (Math.imul(s[0] ^ (s[3] >>> 11), p[0]) ^ (s[1] << 4)) >>> 0;
    s[1] = (Math.imul(s[1] ^ (s[0] >>> 7),  p[1]) ^ (s[2] << 9)) >>> 0;
    s[2] = (Math.imul(s[2] ^ (s[1] >>> 13), p[2]) ^ (s[3] << 3)) >>> 0;
    s[3] = (Math.imul(s[3] ^ (s[2] >>> 5),  p[3]) ^ (s[0] << 7)) >>> 0;
  }
  return s.map(x => x.toString(16).padStart(8, '0')).join('');
}

// ── In-browser database ───────────────────────────────────────
const DB = {
  users()        { return JSON.parse(localStorage.getItem('sci_db_users')  || '{}'); },
  scores()       { return JSON.parse(localStorage.getItem('sci_db_scores') || '[]'); },
  _saveUsers(u)  { localStorage.setItem('sci_db_users',  JSON.stringify(u)); },
  _saveScores(s) { localStorage.setItem('sci_db_scores', JSON.stringify(s)); },

  register(username, email, password) {
    const uname  = (username || '').trim();
    const uemail = (email    || '').trim().toLowerCase();
    if (uname.length < 3)   return { error: 'Username must be at least 3 characters.' };
    if (!uemail.includes('@')) return { error: 'Please enter a valid email address.' };
    if ((password || '').length < 6) return { error: 'Password must be at least 6 characters.' };

    const users = this.users();
    if (Object.values(users).some(u => u.email === uemail))
      return { error: 'That email is already registered.' };
    if (Object.values(users).some(u => u.username.toLowerCase() === uname.toLowerCase()))
      return { error: 'That username is already taken.' };

    const id   = 'u' + Date.now() + Math.random().toString(36).slice(2, 8);
    const hash = hashPw(password);
    users[id]  = { id, username: uname, email: uemail, hash, created_at: new Date().toISOString() };
    this._saveUsers(users);
    return { user: { id, username: uname, email: uemail } };
  },

  login(email, password) {
    const uemail = (email || '').trim().toLowerCase();
    if (!uemail || !password) return { error: 'Email and password are required.' };

    const users = this.users();
    const found = Object.values(users).find(u => u.email === uemail);
    if (!found)                    return { error: 'No account found with that email.' };
    if (hashPw(password) !== found.hash) return { error: 'Incorrect password.' };

    return { user: { id: found.id, username: found.username, email: found.email } };
  },

  addScore(userId, username, payload) {
    const scores = this.scores();
    scores.push({ userId, username, ...payload, created_at: new Date().toISOString() });
    this._saveScores(scores);
  },

  leaderboard() {
    const map = {};
    this.scores().forEach(s => {
      if (!map[s.userId]) {
        map[s.userId] = {
          id: s.userId, username: s.username,
          total_score: 0, total_correct: 0, total_answered: 0,
          games_played: 0, _subj: {}
        };
      }
      const u = map[s.userId];
      u.total_score    += (s.score   || 0);
      u.total_correct  += (s.correct || 0);
      u.total_answered += (s.total   || 0);
      u.games_played++;
      if (s.subject && s.subject !== 'all')
        u._subj[s.subject] = (u._subj[s.subject] || 0) + 1;
    });

    return Object.values(map)
      .map(u => ({
        ...u,
        accuracy: u.total_answered
          ? Math.round(u.total_correct / u.total_answered * 100) : 0,
        top_subject: Object.entries(u._subj)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 50);
  }
};

// ── Session ───────────────────────────────────────────────────
let _user = (() => {
  try { return JSON.parse(localStorage.getItem('sci_user') || 'null'); }
  catch { return null; }
})();

function persistUser(user) {
  _user = user;
  localStorage.setItem('sci_user', JSON.stringify(user));
}
function clearUser() {
  _user = null;
  localStorage.removeItem('sci_user');
}

// ── Public Auth API ───────────────────────────────────────────
window.Auth = {
  get isLoggedIn() { return !!_user; },
  get user()       { return _user;   },

  register(username, email, password) {
    const d = DB.register(username, email, password);
    if (d.user) persistUser(d.user);
    return d;
  },

  login(email, password) {
    const d = DB.login(email, password);
    if (d.user) persistUser(d.user);
    return d;
  },

  logout() {
    clearUser();
    refreshNav();
    document.dispatchEvent(new Event('auth:logout'));
  },

  submitScore(payload) {
    if (!this.isLoggedIn) return;
    DB.addScore(this.user.id, this.user.username, payload);
    renderLeaderboard();
  },

  fetchLeaderboard() { return DB.leaderboard(); }
};

// ── Nav ───────────────────────────────────────────────────────
function refreshNav() {
  document.querySelectorAll('.nav-actions').forEach(el => {
    if (Auth.isLoggedIn) {
      const initials = Auth.user.username.slice(0, 2).toUpperCase();
      el.innerHTML = `
        <div class="nav-user">
          <div class="nav-avatar">${initials}</div>
          <span class="nav-username">${escHtml(Auth.user.username)}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="btn-logout-nav">Sign Out</button>`;
      document.getElementById('btn-logout-nav').addEventListener('click', () => {
        Auth.logout();
        location.reload();
      });
    } else {
      el.innerHTML = `
        <button class="btn btn-ghost btn-sm" id="btn-open-signin">Sign In</button>
        <a href="practice.html" class="btn btn-primary btn-sm">Start Practicing</a>`;
      document.getElementById('btn-open-signin')
        .addEventListener('click', () => AuthModal.open('signin'));
    }
  });
}

// ── Leaderboard renderer ──────────────────────────────────────
function renderLeaderboard() {
  const wrap = document.getElementById('lb-rows');
  if (!wrap) return;

  const rows = Auth.fetchLeaderboard();

  if (!rows.length) {
    wrap.innerHTML = `
      <div class="lb-empty">
        <div style="font-size:36px;margin-bottom:12px">🏁</div>
        <div style="font-weight:600;margin-bottom:6px">No scores yet</div>
        <div style="font-size:13px;color:var(--text-2)">
          Complete a quiz to appear here!
        </div>
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  wrap.innerHTML = rows.map((r, i) => {
    const isMe = Auth.isLoggedIn && r.id === Auth.user.id;
    const rankClass = ['gold', 'silver', 'bronze'][i] || '';
    return `
      <div class="lb-row${isMe ? ' lb-row-me' : ''}">
        <span class="lb-rank ${rankClass}">${medals[i] || (i + 1)}</span>
        <span class="lb-avatar" style="background:${avatarColor(r.username)}">${r.username.slice(0,2).toUpperCase()}</span>
        <div style="flex:1;min-width:0">
          <div class="lb-name">${escHtml(r.username)}${isMe ? ' <span class="lb-you">You</span>' : ''}</div>
          <div class="lb-sub">${r.top_subject || 'Multi-subject'} · ${r.games_played} game${r.games_played !== 1 ? 's' : ''}</div>
        </div>
        <div style="text-align:right">
          <div class="lb-score">${r.total_score.toLocaleString()} pts</div>
          <div style="font-size:11px;color:var(--text-3)">${r.accuracy}% acc</div>
        </div>
      </div>`;
  }).join('');
}

function avatarColor(name) {
  const palette = [
    'rgba(59,130,246,0.3)', 'rgba(168,85,247,0.3)',
    'rgba(45,212,191,0.3)', 'rgba(244,63,94,0.3)',
    'rgba(245,158,11,0.3)', 'rgba(34,197,94,0.3)'
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (Math.imul(h, 31) + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── Auth Modal ────────────────────────────────────────────────
window.AuthModal = {
  _el: null,

  open(mode = 'signin') {
    if (!this._el) this._create();
    this._el.classList.add('show');
    document.body.style.overflow = 'hidden';
    this._tab(mode);
    setTimeout(() => {
      const inp = this._el.querySelector(`.auth-form[data-form="${mode}"] input`);
      if (inp) inp.focus();
    }, 80);
  },

  close() {
    if (this._el) this._el.classList.remove('show');
    document.body.style.overflow = '';
    this._clearErr();
  },

  _tab(t) {
    this._el.querySelectorAll('.auth-tab')
      .forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    this._el.querySelectorAll('.auth-form')
      .forEach(f => { f.style.display = f.dataset.form === t ? 'flex' : 'none'; });
    this._clearErr();
  },

  _clearErr() {
    const e = this._el?.querySelector('.auth-error');
    if (e) { e.textContent = ''; e.hidden = true; }
  },
  _err(msg) {
    const e = this._el.querySelector('.auth-error');
    e.textContent = msg;
    e.hidden = false;
  },
  _setBusy(btn, busy) {
    btn.disabled    = busy;
    btn.textContent = busy ? 'Please wait…' : (btn.dataset.label || btn.textContent);
  },

  _create() {
    const el = document.createElement('div');
    el.id        = 'auth-modal';
    el.className = 'modal-overlay auth-modal-overlay';
    el.innerHTML = `
      <div class="modal-box auth-box">
        <button class="auth-close-btn" aria-label="Close">✕</button>
        <div class="auth-brand">
          <div class="logo-icon" style="width:46px;height:46px;font-size:24px;border-radius:13px">⚗️</div>
          <div>
            <div class="auth-brand-name">EfficientScience</div>
            <div class="auth-brand-sub">Track progress · Climb the rankings</div>
          </div>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="signin">Sign In</button>
          <button class="auth-tab"        data-tab="signup">Create Account</button>
        </div>
        <div class="auth-error" hidden></div>

        <!-- Sign In -->
        <form class="auth-form" data-form="signin" autocomplete="on">
          <div class="auth-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="auth-field">
            <label>Password</label>
            <div class="auth-pw-wrap">
              <input type="password" name="password" placeholder="Your password" autocomplete="current-password" id="si-pw" />
              <button type="button" class="pw-toggle" data-target="si-pw">👁</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary auth-submit" data-label="Sign In">Sign In</button>
          <p class="auth-switch">No account? <a href="#" data-switch="signup">Create one →</a></p>
        </form>

        <!-- Sign Up -->
        <form class="auth-form" data-form="signup" style="display:none" autocomplete="on">
          <div class="auth-field">
            <label>Username</label>
            <input type="text" name="username" placeholder="Pick a username (3+ chars)" autocomplete="username" />
          </div>
          <div class="auth-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="auth-field">
            <label>Password</label>
            <div class="auth-pw-wrap">
              <input type="password" name="password" placeholder="At least 6 characters" autocomplete="new-password" id="su-pw" />
              <button type="button" class="pw-toggle" data-target="su-pw">👁</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary auth-submit" data-label="Create Account">Create Account</button>
          <p class="auth-switch">Have an account? <a href="#" data-switch="signin">Sign in →</a></p>
        </form>
      </div>`;

    document.body.appendChild(el);
    this._el = el;

    // Backdrop + close button
    el.addEventListener('click', e => { if (e.target === el) this.close(); });
    el.querySelector('.auth-close-btn').addEventListener('click', () => this.close());

    // Tab + switch links
    el.querySelectorAll('.auth-tab[data-tab]')
      .forEach(b => b.addEventListener('click', () => this._tab(b.dataset.tab)));
    el.querySelectorAll('[data-switch]')
      .forEach(a => a.addEventListener('click', e => {
        e.preventDefault(); this._tab(a.dataset.switch);
      }));

    // Password reveal
    el.querySelectorAll('.pw-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const inp = el.querySelector('#' + btn.dataset.target);
        inp.type        = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      }));

    // ── Sign In submit ──────────────────────────────────────
    el.querySelector('[data-form="signin"]').addEventListener('submit', e => {
      e.preventDefault();
      const btn  = e.target.querySelector('.auth-submit');
      const email    = e.target.elements.email.value.trim();
      const password = e.target.elements.password.value;

      if (!email || !password) return this._err('Please fill in all fields.');
      this._clearErr();
      this._setBusy(btn, true);

      try {
        const d = Auth.login(email, password);
        this._setBusy(btn, false);
        if (d.error) return this._err(d.error);
        e.target.reset();
        this.close();
        refreshNav();
        renderLeaderboard();
        document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
      } catch (err) {
        this._setBusy(btn, false);
        this._err('Something went wrong. Please try again.');
      }
    });

    // ── Sign Up submit ──────────────────────────────────────
    el.querySelector('[data-form="signup"]').addEventListener('submit', e => {
      e.preventDefault();
      const btn      = e.target.querySelector('.auth-submit');
      const username = e.target.elements.username.value.trim();
      const email    = e.target.elements.email.value.trim();
      const password = e.target.elements.password.value;

      if (!username || !email || !password) return this._err('Please fill in all fields.');
      this._clearErr();
      this._setBusy(btn, true);

      try {
        const d = Auth.register(username, email, password);
        this._setBusy(btn, false);
        if (d.error) return this._err(d.error);
        e.target.reset();
        this.close();
        refreshNav();
        renderLeaderboard();
        document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
      } catch (err) {
        this._setBusy(btn, false);
        this._err('Something went wrong. Please try again.');
      }
    });
  }
};

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshNav();
  renderLeaderboard();
});
