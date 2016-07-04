var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('util');
var MessageFactory = 

app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log(util.inspect(req.body, false, null));
  res.end();
});

app.listen(4000, function() {
  console.log('The app has started and is running on :4000');
});

