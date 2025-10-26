const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

function loadStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: {}, prekeys: {}, challenges: {} };
  }
}

// Call saveStore(store) after mutating the store (register/complete/prekeys handlers)
function saveStore(s) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save store:', e);
  }
}

const store = loadStore();

function base64url(buf) {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// GET /api/auth/user?email=...
app.get('/api/auth/user', (req, res) => {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.json({ exists: false });
    const u = store.users[email];
    if (!u) return res.json({ exists: false });
    res.json({ exists: true, credentialId: u.credentialId });
});

// Simple WebAuthn register begin (returns JSON stub with base64 challenge)
app.post('/api/auth/webauthn/register/begin', (req, res) => {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'missing username' });
    const email = String(username).toLowerCase();
    const challenge = crypto.randomBytes(32);
    store.challenges[email] = { value: base64url(challenge), type: 'webauthn-register', expires: Date.now() + 2 * 60_000 };
    // Minimal PublicKeyCredentialCreationOptions-like object (client may need to decode)
    const options = {
        challenge: base64url(challenge),
        rp: { name: 'Cipher Chat' },
        user: {
            id: base64url(Buffer.from(email)),
            name: email,
            displayName: email,
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        timeout: 60000,
        attestation: 'none'
    };
    res.json(options);
});

// Register complete stub - accepts JSON attestation and stores a fake credential id
app.post('/api/auth/webauthn/register/complete', (req, res) => {
    const payload = req.body || {};
    // For dev: accept and store a generated credentialId if username was present in stored challenge
    // Client should send enough info in a real implementation
    const { id, rawId, response, type } = payload;
    // Try to find an associated email via challenges (best-effort)
    const email = Object.keys(store.challenges).find(e => store.challenges[e].value && store.challenges[e].value === (response?.clientDataJSON || store.challenges[e].value));
    // Fallback: allow registration without mapping (dev convenience)
    const credId = id || (rawId ? rawId : base64url(crypto.randomBytes(16)));
    // If no email found, store under a placeholder (client must call /api/auth/user afterwards)
    const target = email || 'unknown@example.com';
    store.users[target] = { credentialId: credId, publicKey: 'dev-placeholder' };
    res.json({ ok: true, credentialId: credId });
});

// WebAuthn login begin stub
app.post('/api/auth/webauthn/login/begin', (req, res) => {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'missing username' });
    const email = String(username).toLowerCase();
    const challenge = crypto.randomBytes(32);
    store.challenges[email] = { value: base64url(challenge), type: 'webauthn-login', expires: Date.now() + 2 * 60_000 };
    const user = store.users[email];
    const options = {
        challenge: base64url(challenge),
        timeout: 60000,
        allowCredentials: user && user.credentialId ? [{ id: user.credentialId, type: 'public-key' }] : [],
        userVerification: 'preferred'
    };
    res.json(options);
});

// WebAuthn login complete stub
app.post('/api/auth/webauthn/login/complete', (req, res) => {
    // Accept any assertion in dev; in real server verify signature and signCount
    const payload = req.body || {};
    // find email by credentialId
    const email = Object.keys(store.users).find(e => store.users[e].credentialId === payload.id) || null;
    if (!email) {
        return res.status(400).json({ ok: false, error: 'unknown-credential' });
    }
    // successful auth: respond with session token (dev-only)
    const sessionToken = base64url(crypto.randomBytes(24));
    res.json({ ok: true, sessionToken });
});

// GET /api/prekeys/:email
app.get('/api/prekeys/:email', (req, res) => {
    const email = String(req.params.email || '').toLowerCase();
    const arr = store.prekeys[email] || [];
    res.json(arr);
});

// POST /api/prekeys/upload
app.post('/api/prekeys/upload', (req, res) => {
    const { email, prekeys } = req.body || {};
    if (!email || !Array.isArray(prekeys)) return res.status(400).json({ error: 'missing email or prekeys' });
    const e = String(email).toLowerCase();
    store.prekeys[e] = store.prekeys[e] ? store.prekeys[e].concat(prekeys) : prekeys.slice();
    res.json({ ok: true, count: store.prekeys[e].length });
});

app.listen(PORT, () => {
    console.log(`Dev backend listening on http://localhost:${PORT}`);
});