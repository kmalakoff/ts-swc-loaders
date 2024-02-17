require('core-js/actual/symbol/for');
require('core-js/actual/map');

var assert = require('assert');
var App = require('./lib/react.tsx');
var string = require('./lib/string.cjs');

assert.ok(App);
assert.equal(string, 'string');

console.log(`success: ${process.argv[process.argv.length-1]}`);
