const express = require('express');
const path = require('path');
const app = express();

// Development CSP middleware - relaxes the overly restrictive "default-src 'none'"
// Replace or remove for production; prefer nonces/hashes in production.
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' https:; img-src 'self' data:;"
    );
    next();
});

app.use((req, res, next) => {
    console.log('[server.js] incoming:', req.method, req.url);
    next();
});

// Serve static files from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Ensure root returns index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4000, () => console.log('Listening on http://localhost:4000'));


