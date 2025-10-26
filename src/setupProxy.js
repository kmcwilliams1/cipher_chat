const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('[setupProxy] loading proxy for /api -> http://localhost:4000');

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
            onProxyReq(proxyReq, req, res) {
                console.log('[setupProxy] proxying request:', req.method, req.originalUrl || req.url);
            },
            onProxyRes(proxyRes, req, res) {
                console.log('[setupProxy] proxied response for:', req.method, req.originalUrl || req.url, '->', proxyRes.statusCode);
            },
        })
    );
};
