require('core-js/actual/symbol/for');
require('core-js/actual/map');

var App = require('./lib/react.tsx');
var string = require('./lib/string.cjs');

if (!App.default) throw new Error('App not loaded');
if (string !== 'string') throw new Error('String not equal to string')

console.log('Success!');

process.exit(0);
