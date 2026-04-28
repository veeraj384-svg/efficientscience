const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'effscience-dev-secret';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ── Database ────────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT UNIQUE NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS scores (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject    TEXT NOT NULL DEFAULT 'All',
    grade      TEXT NOT NULL DEFAULT 'All',
    difficulty TEXT NOT NULL DEFAULT 'All',
    score      INTEGER NOT NULL DEFAULT 0,
    correct    INTEGER NOT NULL DEFAULT 0,
    total      INTEGER NOT NULL DEFAULT 0,
    pct        INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_scores_user    ON scores(user_id);
  CREATE INDEX IF NOT EXISTS idx_scores_score   ON scores(score DESC);
  CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at DESC);
`);

// ── Auth middleware ─────────────────────────────────────────
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(h.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Auth routes ─────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (username.trim().length < 3)
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const hash = bcrypt.hashSync(password, 10);
  try {
    const r = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username.trim(), email.trim().toLowerCase(), hash);
    const token = jwt.sign({ id: r.lastInsertRowid, username: username.trim() }, SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: r.lastInsertRowid, username: username.trim(), email: email.trim().toLowerCase() } });
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      const field = e.message.toLowerCase().includes('email') ? 'email' : 'username';
      return res.status(409).json({ error: `That ${field} is already taken.` });
    }
    console.error(e);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?')
    .get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password.' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare(
    'SELECT id, username, email, created_at FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const stats = db.prepare(`
    SELECT
      COUNT(*)       AS games,
      COALESCE(SUM(correct), 0) AS correct,
      COALESCE(SUM(total),   0) AS total_answered,
      COALESCE(SUM(score),   0) AS total_score,
      COALESCE(MAX(pct),     0) AS best_pct
    FROM scores WHERE user_id = ?
  `).get(user.id);

  const rank = db.prepare(`
    WITH ranked AS (
      SELECT user_id, RANK() OVER (ORDER BY SUM(score) DESC) AS rnk
      FROM scores GROUP BY user_id
    )
    SELECT rnk FROM ranked WHERE user_id = ?
  `).get(user.id);

  res.json({ ...user, stats, rank: rank?.rnk ?? null });
});

// ── Score routes ────────────────────────────────────────────
app.post('/api/scores', auth, (req, res) => {
  const { subject, grade, difficulty, score, correct, total, pct } = req.body || {};
  db.prepare(`
    INSERT INTO scores (user_id, subject, grade, difficulty, score, correct, total, pct)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    subject    || 'All',
    grade      || 'All',
    difficulty || 'All',
    score   || 0,
    correct || 0,
    total   || 0,
    pct     || 0
  );
  res.json({ ok: true });
});

// ── Leaderboard ─────────────────────────────────────────────
app.get('/api/leaderboard', (req, res) => {
  const rows = db.prepare(`
    SELECT
      u.id,
      u.username,
      SUM(s.score)                                                AS total_score,
      SUM(s.correct)                                             AS total_correct,
      SUM(s.total)                                               AS total_answered,
      COUNT(*)                                                   AS games_played,
      ROUND(CAST(SUM(s.correct) AS REAL) / MAX(SUM(s.total), 1) * 100) AS accuracy,
      (
        SELECT subject FROM scores
        WHERE user_id = u.id
        GROUP BY subject ORDER BY COUNT(*) DESC LIMIT 1
      ) AS top_subject
    FROM users u
    JOIN scores s ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY total_score DESC
    LIMIT 50
  `).all();
  res.json(rows);
});

app.get('/api/leaderboard/me', auth, (req, res) => {
  const rank = db.prepare(`
    WITH ranked AS (
      SELECT user_id, SUM(score) AS pts,
             RANK() OVER (ORDER BY SUM(score) DESC) AS rnk
      FROM scores GROUP BY user_id
    )
    SELECT rnk, pts FROM ranked WHERE user_id = ?
  `).get(req.user.id);
  res.json(rank || { rnk: null, pts: 0 });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅  EfficientScience running → http://localhost:${PORT}`)
);
