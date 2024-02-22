require('core-js/actual/symbol/for');
require('core-js/actual/map');

const exit = require('exit');

var App = require('./lib/App.tsx');
var string = require('./lib/string.cjs');

if (!App.default) throw new Error('App not loaded');
if (string !== 'string') throw new Error('String not equal to string')

console.log('Success!');

exit(0); // ensure stdout is drained
