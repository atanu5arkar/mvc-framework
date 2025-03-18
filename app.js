import http from "http";
import https from "https";
import { readFileSync } from "fs";

import "./utils/dbConnection.js";
import router from "./router/router.js";

const httpPort = 80;
const httpsPort = 443;

// 308 status code has been used for proper forwarding of POST requests
const httpServer = http.createServer((req, res) => {
    const { host } = req.headers;
    res.writeHead(308, { 'Location': `https://${host}${req.url}` });
    return res.end();
});

// New SSL Certificates are needed
const httpsServer = https.createServer({
    key: readFileSync('utils/certs/privkey.pem'),
    cert: readFileSync('utils/certs/fullchain.pem')
}, router);

httpServer.listen(httpPort, () =>
    console.log(`HTTP server running at ${httpPort}.`));

httpsServer.listen(httpsPort, () =>
    console.log(`HTTPS server running at ${httpsPort}.`));
