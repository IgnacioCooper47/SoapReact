const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
    '/ws',
    createProxyMiddleware({
        target: 'http://localhost:8080', // URL de tu backend SOAP
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        },
        onProxyRes: (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = '*';
        },
    })
);

app.listen(3001, () => {
    console.log('Proxy server is running on http://localhost:3001');
});