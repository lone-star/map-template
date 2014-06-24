var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/build'));

app.get('/', function(req, res) {
  fs.createReadStream('./index.html').pipe(res);
});

module.exports = {};
module.exports.start = function() {
  app.listen(3000, function() {
    console.log('Listening on port 3000');
  });
};
