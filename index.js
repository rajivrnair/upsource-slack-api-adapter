var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var util = require('util');
var app = require('./app');

server.use(bodyParser.json());

server.post('/', function (req, res) {
  app.talkToSlack(req.body, req.query);
  res.end();
});

server.listen(4000, function() {
  console.log('The app has started and is running on :4000');
});

