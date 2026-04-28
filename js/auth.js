/* =========================================================
   EfficientScience – Auth Module (client-side, no server needed)
   Uses localStorage as DB + Web Crypto API for password hashing.
   ========================================================= */

// ── In-browser database ───────────────────────────────────────
const DB = {
  // users:  { [id]: { id, username, email, hash, created_at } }
  // scores: [{ userId, username, subject, grade, difficulty,
  //            score, correct, total, pct, created_at }, ...]

  users()  { return JSON.parse(localStorage.getItem('sci_db_users')  || '{}'); },
  scores() { return JSON.parse(localStorage.getItem('sci_db_scores') || '[]'); },
  _saveUsers(u)  { localStorage.setItem('sci_db_users',  JSON.stringify(u)); },
  _saveScores(s) { localStorage.setItem('sci_db_scores', JSON.stringify(s)); },

  async hashPw(pw) {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(pw + ':effscience-salt')
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async register(username, email, password) {
    if (!username || username.trim().length < 3)
      return { error: 'Username must be at least 3 characters.' };
    if (!email || !email.includes('@'))
      return { error: 'Please enter a valid email.' };
    if (!password || password.length < 6)
      return { error: 'Password must be at least 6 characters.' };

    const users = this.users();
    const uname = username.trim();
    const uemail = email.trim().toLowerCase();

    if (Object.values(users).some(u => u.email === uemail))
      return { error: 'That email is already registered.' };
    if (Object.values(users).some(u => u.username.toLowerCase() === uname.toLowerCase()))
      return { error: 'That username is already taken.' };

    const id   = `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const hash = await this.hashPw(password);
    users[id]  = { id, username: uname, email: uemail, hash, created_at: new Date().toISOString() };
    this._saveUsers(users);
    return { user: { id, username: uname, email: uemail } };
  },

  async login(email, password) {
    if (!email || !password) return { error: 'Email and password required.' };
    const users = this.users();
    const user  = Object.values(users).find(u => u.email === email.trim().toLowerCase());
    if (!user)  return { error: 'Invalid email or password.' };
    const hash  = await this.hashPw(password);
    if (hash !== user.hash) return { error: 'Invalid email or password.' };
    return { user: { id: user.id, username: user.username, email: user.email } };
  },

  addScore(userId, username, payload) {
    const scores = this.scores();
    scores.push({ userId, username, ...payload, created_at: new Date().toISOString() });
    this._saveScores(scores);
  },

  leaderboard() {
    const map = {};
    this.scores().forEach(s => {
      if (!map[s.userId]) map[s.userId] = {
        id: s.userId, username: s.username,
        total_score: 0, total_correct: 0, total_answered: 0,
        games_played: 0, _subj: {}
      };
      const u = map[s.userId];
      u.total_score    += (s.score    || 0);
      u.total_correct  += (s.correct  || 0);
      u.total_answered += (s.total    || 0);
      u.games_played++;
      if (s.subject && s.subject !== 'all')
        u._subj[s.subject] = (u._subj[s.subject] || 0) + 1;
    });

    return Object.values(map)
      .map(u => ({
        ...u,
        accuracy: u.total_answered > 0
          ? Math.round(u.total_correct / u.total_answered * 100) : 0,
        top_subject: Object.entries(u._subj).sort((a, b) => b[1] - a[1])[0]?.[0] || null
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 50);
  },

  myRank(userId) {
    const lb = this.leaderboard();
    const i  = lb.findIndex(r => r.id === userId);
    return i === -1 ? null : i + 1;
  }
};

// ── Session helpers ───────────────────────────────────────────
let _user = JSON.parse(localStorage.getItem('sci_user') || 'null');

function persistUser(user) {
  _user = user;
  localStorage.setItem('sci_user', JSON.stringify(user));
}
function clearUser() {
  _user = null;
  localStorage.removeItem('sci_user');
}

// ── Public Auth object ────────────────────────────────────────
window.Auth = {
  get isLoggedIn() { return !!_user; },
  get user()       { return _user; },

  async register(username, email, password) {
    const d = await DB.register(username, email, password);
    if (d.user) persistUser(d.user);
    return d;
  },

  async login(email, password) {
    const d = await DB.login(email, password);
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

  fetchLeaderboard() { return DB.leaderboard(); },
  myRank()           { return this.isLoggedIn ? DB.myRank(this.user.id) : null; }
};

// ── Nav state ────────────────────────────────────────────────
function refreshNav() {
  document.querySelectorAll('.nav-actions').forEach(el => {
    if (Auth.isLoggedIn) {
      const initials = Auth.user.username.slice(0, 2).toUpperCase();
      el.innerHTML = `
        <div class="nav-user">
          <div class="nav-avatar">${initials}</div>
          <span class="nav-username">${escHtml(Auth.user.username)}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="btn-logout-nav">Sign Out</button>
      `;
      el.querySelector('#btn-logout-nav').addEventListener('click', () => {
        Auth.logout(); location.reload();
      });
    } else {
      el.innerHTML = `
        <button class="btn btn-ghost btn-sm" id="btn-open-signin">Sign In</button>
        <a href="practice.html" class="btn btn-primary btn-sm">Start Practicing</a>
      `;
      el.querySelector('#btn-open-signin')
        .addEventListener('click', () => AuthModal.open('signin'));
    }
  });
}

// ── Live Leaderboard renderer ─────────────────────────────────
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
          Complete a quiz to appear on the leaderboard!
        </div>
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  wrap.innerHTML = rows.map((r, i) => {
    const isMe  = Auth.isLoggedIn && r.id === Auth.user.id;
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const initials  = r.username.slice(0, 2).toUpperCase();
    return `
      <div class="lb-row ${isMe ? 'lb-row-me' : ''}">
        <span class="lb-rank ${rankClass}">${medals[i] || (i + 1)}</span>
        <span class="lb-avatar" style="background:${avatarColor(r.username)}">${initials}</span>
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
  const colors = [
    'rgba(59,130,246,0.25)','rgba(168,85,247,0.25)','rgba(45,212,191,0.25)',
    'rgba(244,63,94,0.25)', 'rgba(245,158,11,0.25)', 'rgba(34,197,94,0.25)'
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFF;
  return colors[Math.abs(h) % colors.length];
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── Auth Modal ───────────────────────────────────────────────
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
    }, 100);
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
      .forEach(f => f.style.display = f.dataset.form === t ? 'flex' : 'none');
    this._clearErr();
  },

  _clearErr() {
    const e = this._el?.querySelector('.auth-error');
    if (e) { e.textContent = ''; e.hidden = true; }
  },
  _err(msg) {
    const e = this._el.querySelector('.auth-error');
    e.textContent = msg; e.hidden = false;
  },
  _busy(btn, yes) {
    btn.disabled = yes;
    btn.textContent = yes ? 'Please wait…' : btn.dataset.label;
  },

  _create() {
    const el = document.createElement('div');
    el.id = 'auth-modal';
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
          <button class="auth-tab" data-tab="signup">Create Account</button>
        </div>

        <div class="auth-error" hidden></div>

        <!-- Sign In -->
        <form class="auth-form" data-form="signin" id="form-signin" novalidate>
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
        <form class="auth-form" data-form="signup" id="form-signup" novalidate style="display:none">
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
      </div>
    `;

    document.body.appendChild(el);
    this._el = el;

    el.querySelector('.auth-close-btn').addEventListener('click', () => this.close());
    el.addEventListener('click', e => { if (e.target === el) this.close(); });

    el.querySelectorAll('.auth-tab[data-tab]').forEach(b =>
      b.addEventListener('click', () => this._tab(b.dataset.tab)));
    el.querySelectorAll('[data-switch]').forEach(a =>
      a.addEventListener('click', e => { e.preventDefault(); this._tab(a.dataset.switch); }));

    el.querySelectorAll('.pw-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const inp = el.querySelector(`#${btn.dataset.target}`);
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      }));

    // Sign In submit
    el.querySelector('#form-signin').addEventListener('submit', async e => {
      e.preventDefault();
      const btn = e.target.querySelector('.auth-submit');
      const { email, password } = e.target.elements;
      if (!email.value || !password.value) return this._err('Please fill in all fields.');
      this._clearErr(); this._busy(btn, true);
      const d = await Auth.login(email.value, password.value);
      this._busy(btn, false);
      if (d.error) return this._err(d.error);
      this.close();
      refreshNav();
      renderLeaderboard();
      document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
    });

    // Sign Up submit
    el.querySelector('#form-signup').addEventListener('submit', async e => {
      e.preventDefault();
      const btn = e.target.querySelector('.auth-submit');
      const { username, email, password } = e.target.elements;
      if (!username.value || !email.value || !password.value)
        return this._err('Please fill in all fields.');
      this._clearErr(); this._busy(btn, true);
      const d = await Auth.register(username.value, email.value, password.value);
      this._busy(btn, false);
      if (d.error) return this._err(d.error);
      this.close();
      refreshNav();
      renderLeaderboard();
      document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
    });
  }
};

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshNav();
  renderLeaderboard();
});
