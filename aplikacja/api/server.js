var express = require('express');
var path = require('path');
const http = require('http');

var app = express();

app.use(express.static(__dirname + '/dist'));

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const server = http.createServer(app);

server.listen(80, () => console.log(`App running on: http://localhost:80`));
