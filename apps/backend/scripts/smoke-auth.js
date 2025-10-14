/*
  Simple smoke test to seed admin, login, and call /api/users.
  Run: npm run smoke (from apps/backend)
*/

const BASE = process.env.BASE_URL || 'http://localhost:5001';

async function json(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

(async () => {
  try {
    // Seed admin (GET convenience)
    let r = await fetch(`${BASE}/api/auth/seed-admin`);
    let body = await json(r);
    console.log('seed-admin:', r.status, body);

    // Login
    r = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ecocollect.local', password: 'admin123' })
    });
    body = await json(r);
    if (!r.ok) throw new Error('login failed: ' + JSON.stringify(body));
    console.log('login:', r.status, body.user);
    const token = body.token;

    // Users
    r = await fetch(`${BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
    body = await json(r);
    console.log('users:', r.status, Array.isArray(body) ? body.length + ' users' : body);

    process.exit(0);
  } catch (e) {
    console.error('Smoke test error:', e.message || e);
    process.exit(1);
  }
})();
