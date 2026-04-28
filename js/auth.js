/* =========================================================
   EfficientScience – Auth + Rankings
   Server-backed (SQLite via Express on :3000).
   All shared state lives on the server so every browser/device
   sees the same leaderboard and the same accounts.
   ========================================================= */

const API_BASE = (() => {
  const { protocol, hostname } = window.location;
  return (protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : '/api';
})();

// ── HTTP helper ───────────────────────────────────────────────
async function apiFetch(method, path, body, token) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res  = await fetch(API_BASE + path, {
      method, headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? data : { error: data.error || `Server error (${res.status})` };
  } catch {
    return { _offline: true, error: 'Server offline' };
  }
}

// ── Session (stored in localStorage so page refresh keeps login) ──
let _token = localStorage.getItem('sci_token') || null;
let _user  = (() => {
  try { return JSON.parse(localStorage.getItem('sci_user') || 'null'); } catch { return null; }
})();

function _saveSession(token, user) {
  _token = token; _user = user;
  localStorage.setItem('sci_token', token);
  localStorage.setItem('sci_user', JSON.stringify(user));
}
function _clearSession() {
  _token = null; _user = null;
  localStorage.removeItem('sci_token');
  localStorage.removeItem('sci_user');
}

// ── Public Auth API ───────────────────────────────────────────
window.Auth = {
  get isLoggedIn() { return !!_token && !!_user; },
  get user()       { return _user;  },
  get token()      { return _token; },

  async register(username, email, password) {
    const d = await apiFetch('POST', '/auth/register', { username, email, password });
    if (d.token) _saveSession(d.token, d.user);
    return d;
  },

  async login(email, password) {
    const d = await apiFetch('POST', '/auth/login', { email, password });
    if (d.token) _saveSession(d.token, d.user);
    return d;
  },

  logout() {
    _clearSession();
    location.reload();
  },

  async submitScore(payload) {
    if (!this.isLoggedIn) return { error: 'Not logged in' };
    return apiFetch('POST', '/scores', payload, _token);
  },

  async fetchLeaderboard() {
    return apiFetch('GET', '/leaderboard');
  }
};

// ── Server status banner ──────────────────────────────────────
let _serverOnline = null; // null = unknown, true/false after check

async function checkServerAndBanner() {
  const d = await apiFetch('GET', '/leaderboard');
  _serverOnline = !d._offline;

  let banner = document.getElementById('server-banner');
  if (_serverOnline) {
    if (banner) banner.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'server-banner';
    banner.innerHTML = `
      <span>⚠️ Server offline — rankings and sign-in require the server.</span>
      <span style="opacity:.7;margin-left:8px;font-size:12px">Run <code>npm start</code> then refresh.</span>
    `;
    document.body.prepend(banner);
  }
}

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
      document.getElementById('btn-logout-nav')
        .addEventListener('click', () => Auth.logout());
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
async function renderLeaderboard() {
  const wrap = document.getElementById('lb-rows');
  if (!wrap) return;

  wrap.innerHTML = `<div class="lb-loading">Loading rankings…</div>`;

  const rows = await Auth.fetchLeaderboard();

  if (rows._offline) {
    wrap.innerHTML = `
      <div class="lb-empty">
        <div style="font-size:32px;margin-bottom:10px">🔌</div>
        <div style="font-weight:600;margin-bottom:6px">Server offline</div>
        <div style="font-size:13px;color:var(--text-2)">
          Run <code style="background:var(--surface-2);padding:2px 6px;border-radius:4px">npm start</code> then refresh to see live rankings.
        </div>
      </div>`;
    return;
  }

  if (!Array.isArray(rows) || !rows.length) {
    wrap.innerHTML = `
      <div class="lb-empty">
        <div style="font-size:36px;margin-bottom:12px">🏁</div>
        <div style="font-weight:600;margin-bottom:6px">No scores yet</div>
        <div style="font-size:13px;color:var(--text-2)">Complete a quiz to appear here!</div>
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
          <div class="lb-score">${Number(r.total_score).toLocaleString()} pts</div>
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
  return String(s).replace(/[&<>"']/g,
    c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
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
  _err(msg, isOffline) {
    const e = this._el.querySelector('.auth-error');
    e.innerHTML = isOffline
      ? `🔌 Server offline. Run <code>npm start</code> in the project folder, then try again.`
      : escHtml(msg);
    e.hidden = false;
  },
  _busy(btn, yes) {
    btn.disabled    = yes;
    btn.textContent = yes ? 'Please wait…' : btn.dataset.label;
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

    el.addEventListener('click', e => { if (e.target === el) this.close(); });
    el.querySelector('.auth-close-btn').addEventListener('click', () => this.close());
    el.querySelectorAll('.auth-tab[data-tab]')
      .forEach(b => b.addEventListener('click', () => this._tab(b.dataset.tab)));
    el.querySelectorAll('[data-switch]')
      .forEach(a => a.addEventListener('click', e => { e.preventDefault(); this._tab(a.dataset.switch); }));
    el.querySelectorAll('.pw-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const inp = el.querySelector('#' + btn.dataset.target);
        inp.type        = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      }));

    // Sign In
    el.querySelector('[data-form="signin"]').addEventListener('submit', async e => {
      e.preventDefault();
      const btn      = e.target.querySelector('.auth-submit');
      const email    = e.target.elements.email.value.trim();
      const password = e.target.elements.password.value;
      if (!email || !password) return this._err('Please fill in all fields.');
      this._clearErr(); this._busy(btn, true);
      const d = await Auth.login(email, password);
      this._busy(btn, false);
      if (d._offline) return this._err('', true);
      if (d.error)    return this._err(d.error);
      e.target.reset();
      this.close();
      refreshNav();
      renderLeaderboard();
    });

    // Sign Up
    el.querySelector('[data-form="signup"]').addEventListener('submit', async e => {
      e.preventDefault();
      const btn      = e.target.querySelector('.auth-submit');
      const username = e.target.elements.username.value.trim();
      const email    = e.target.elements.email.value.trim();
      const password = e.target.elements.password.value;
      if (!username || !email || !password) return this._err('Please fill in all fields.');
      this._clearErr(); this._busy(btn, true);
      const d = await Auth.register(username, email, password);
      this._busy(btn, false);
      if (d._offline) return this._err('', true);
      if (d.error)    return this._err(d.error);
      e.target.reset();
      this.close();
      refreshNav();
      renderLeaderboard();
    });
  }
};

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshNav();
  renderLeaderboard();
  checkServerAndBanner();
});
