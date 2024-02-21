require('core-js/actual/symbol/for');
require('core-js/actual/map');

console.log(1, process.argv);

try {
  var string = require('./lib/string.cjs');
  console.log(2);
  var App = require('./lib/react.tsx');
} catch (err) {
  console.log(err)
}
console.log(3);

if (string !== 'string') throw new Error('String not equal to string')
if (!App.default) throw new Error('App not loaded');
console.log(4);

console.log(5);

console.log('ran successfully');

process.exit(0);
