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

app.use(express.static(__dirname + '/dist'));

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
  if (req.protocol === 'https' && req.hostname === 'www.localhost') {
    return res.redirect(301, `https://localhost:443`);
  }
  next();
});

server.listen(443, () => console.log(`App running on: https://localhost:443`));