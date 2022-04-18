const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const router = express.Router();
const nodemailer = require('nodemailer');
const history = require('connect-history-api-fallback');
const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const staticFileMiddleware = express.static(__dirname + '/www/dist/');
app.use(staticFileMiddleware);
app.use(express.json());
app.use(express.urlencoded());

const emailSender = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: '',
        pass: '',
    }
});

app.get('/hello', (req, res) => {
    res.send('Howdy!');
});

app.post('/submit/inquiry', async (req, res) => {
    let form_data = req.body;
    try {
        await emailSender.sendMail({
            from: 'campflambeau@gmail.com',
            to: 'campflambeau@gmail.com',
            subject: 'CAMP FLAMBEAU INQUIRY SUBMISSION',
            text: `Name: ${form_data.name} \nEmail: ${form_data.email} \n\nPreferred Start Date: ${form_data.startDate} \nPreferred End Date: ${form_data.endDate} \n\n${form_data.message} \n\nDO NOT REPLY \nUse guest's email to reply. (found at top of email)`,
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
    res.sendStatus(200);
});

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