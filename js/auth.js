/* =========================================================
   EfficientScience – Auth Module
   Handles: sign-in/up modal · JWT storage · nav state · leaderboard
   ========================================================= */

const API = (() => {
  const { hostname, protocol, port } = window.location;
  // Opened as a file:// OR served from the Node server on :3000
  if (protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  // Same-origin deploy (production)
  return '/api';
})();

let _token = localStorage.getItem('sci_token') || null;
let _user  = JSON.parse(localStorage.getItem('sci_user') || 'null');

// ── HTTP helpers ─────────────────────────────────────────────
async function apiCall(method, path, body, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && _token) headers['Authorization'] = `Bearer ${_token}`;
  try {
    const r = await fetch(API + path, {
      method, headers, body: body ? JSON.stringify(body) : undefined
    });
    return await r.json();
  } catch {
    return { error: 'Cannot connect to server. Make sure it is running.' };
  }
}

function persistSession(token, user) {
  _token = token; _user = user;
  localStorage.setItem('sci_token', token);
  localStorage.setItem('sci_user', JSON.stringify(user));
}
function clearSession() {
  _token = null; _user = null;
  localStorage.removeItem('sci_token');
  localStorage.removeItem('sci_user');
}

// ── Public Auth object ────────────────────────────────────────
window.Auth = {
  get isLoggedIn() { return !!_token && !!_user; },
  get user()       { return _user; },
  get token()      { return _token; },

  async register(username, email, password) {
    const d = await apiCall('POST', '/auth/register', { username, email, password });
    if (d.token) persistSession(d.token, d.user);
    return d;
  },
  async login(email, password) {
    const d = await apiCall('POST', '/auth/login', { email, password });
    if (d.token) persistSession(d.token, d.user);
    return d;
  },
  logout() {
    clearSession();
    refreshNav();
    document.dispatchEvent(new Event('auth:logout'));
  },
  async submitScore(payload) {
    if (!this.isLoggedIn) return null;
    return apiCall('POST', '/scores', payload, true);
  },
  async fetchLeaderboard() {
    return apiCall('GET', '/leaderboard');
  },
  async fetchMyRank() {
    if (!this.isLoggedIn) return null;
    return apiCall('GET', '/leaderboard/me', null, true);
  }
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

// ── Live Leaderboard ─────────────────────────────────────────
async function renderLeaderboard() {
  const wrap = document.getElementById('lb-rows');
  if (!wrap) return;

  wrap.innerHTML = `<div class="lb-loading">Loading rankings…</div>`;
  const rows = await Auth.fetchLeaderboard();

  if (!Array.isArray(rows) || rows.length === 0) {
    wrap.innerHTML = `
      <div class="lb-empty">
        <div style="font-size:36px;margin-bottom:12px">🏁</div>
        <div style="font-weight:600;margin-bottom:6px">No scores yet</div>
        <div style="font-size:13px;color:var(--text-2)">Be the first to complete a quiz!</div>
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  wrap.innerHTML = rows.map((r, i) => {
    const isMe = Auth.isLoggedIn && r.id === Auth.user.id;
    const medal = i < 3 ? medals[i] : null;
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const initials = r.username.slice(0, 2).toUpperCase();
    return `
      <div class="lb-row ${isMe ? 'lb-row-me' : ''}">
        <span class="lb-rank ${rankClass}">${medal || (i + 1)}</span>
        <span class="lb-avatar" style="background:${avatarColor(r.username)}">${initials}</span>
        <div style="flex:1;min-width:0">
          <div class="lb-name">${escHtml(r.username)}${isMe ? ' <span class="lb-you">You</span>' : ''}</div>
          <div class="lb-sub">${r.top_subject || 'Multi-subject'} · ${r.games_played} game${r.games_played === 1 ? '' : 's'}</div>
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
    'rgba(244,63,94,0.25)','rgba(245,158,11,0.25)','rgba(34,197,94,0.25)'
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFF;
  return colors[Math.abs(h) % colors.length];
}
function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── Auth Modal ───────────────────────────────────────────────
window.AuthModal = {
  _el: null,

  open(mode = 'signin') {
    if (!this._el) this._create();
    this._el.classList.add('show');
    document.body.style.overflow = 'hidden';
    this._tab(mode);
    // Focus first input
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
          <div class="auth-tab-indicator"></div>
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

    // close on backdrop / X
    el.querySelector('.auth-close-btn').addEventListener('click', () => this.close());
    el.addEventListener('click', e => { if (e.target === el) this.close(); });

    // tab switching
    el.querySelectorAll('.auth-tab[data-tab]').forEach(b =>
      b.addEventListener('click', () => this._tab(b.dataset.tab)));
    el.querySelectorAll('[data-switch]').forEach(a =>
      a.addEventListener('click', e => { e.preventDefault(); this._tab(a.dataset.switch); }));

    // password reveal toggles
    el.querySelectorAll('.pw-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const inp = el.querySelector(`#${btn.dataset.target}`);
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      }));

    // sign-in submit
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
      document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
      renderLeaderboard();
    });

    // sign-up submit
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
      document.dispatchEvent(new CustomEvent('auth:login', { detail: d.user }));
      renderLeaderboard();
    });
  }
};

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshNav();
  renderLeaderboard();
});
