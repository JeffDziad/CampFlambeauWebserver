const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const history = require('connect-history-api-fallback');
const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const staticFileMiddleware = express.static(__dirname + '/www/dist/');
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(staticFileMiddleware);
app.use(express.json());
app.use(express.urlencoded());

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    key: fs.readFileSync('./pvt/privkey.pem'),
    cert: fs.readFileSync('./pvt/fullchain.pem'),
}, app);

httpServer.listen(HTTP_PORT, () => {
   console.log('[Http] Server running on port: ' + HTTP_PORT);
});
httpsServer.listen(HTTPS_PORT, () => {
    console.log('[Https] Server running on port: ' + HTTPS_PORT);
});