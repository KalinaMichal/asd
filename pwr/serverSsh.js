var express = require('express');
var path = require('path');
const https = require('https');
const fs = require('fs');

const hostName = 'converetti.com';

const httpsOptions = {
	cert: fs.readFileSync('./ssl/converetti_com.crt'),
	ca: fs.readFileSync('./ssl/converetti_com.ca-bundle'),
	key: fs.readFileSync('./ssl/converetti_com.key')
};

var app = express();

app.use(express.static(__dirname + '/dist', {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
}));

app.get('*', function (req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const server = https.createServer(httpsOptions, app);

app.use((req, res, next) => {
   if(req.protocol === 'http') {
     res.redirect(301, `https://localhost:443`);
   }
   next();
});

app.use((req, res, next) => {
  if (req.protocol === 'https' && req.hostname === 'www.converetti.com') {
    return res.redirect(301, `https://converetti.com:443`);
  }
  next();
});

server.listen(443, () => console.log(`App running on: https://localhost:443`));