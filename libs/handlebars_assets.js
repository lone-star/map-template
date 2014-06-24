var handlebars = require('handlebars');
var through = require('through');

var filenamePattern = /\.(html|handlebars|hbs)$/;

function wrap(template) {
  return 'var templater = require("handlebars/runtime")["default"].template;' + 'module.exports = templater(' + template + ');'
}


/*
 * Transform for bowserify.
 * It will compile all templates and wrap them for usage on client side
 * Inspired by: https://github.com/dlmanning/browserify-handlebars/blob/master/index.js
 * However, we cannot use the pluggin, since we want access to the latest
 * Handlebars version.
 */
module.exports = function(file) {
  if (!filenamePattern.test(file)) return through();

  var input = '';

  function write(buffer) {
    input += buffer;
  }

  function end() {
    this.queue(wrap(handlebars.precompile(input)));
    this.queue(null);
  }

  return through(write, end);

}
