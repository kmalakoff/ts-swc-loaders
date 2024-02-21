require('core-js/actual/symbol/for');
require('core-js/actual/map');

console.log(1, process.argv);

try {
var App = require('./lib/react.tsx');
console.log(2);
var string = require('./lib/string.cjs');
} catch (err) {
  console.log(err)
}
console.log(3);

if (!App.default) throw new Error('App not loaded');
console.log(4);
if (string !== 'string') throw new Error('String not equal to string')

console.log(5);

console.log('ran successfully');

process.exit(0);
