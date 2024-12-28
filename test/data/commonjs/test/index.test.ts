require('core-js/actual/object/assign');
require('core-js/actual/symbol/for');
require('core-js/actual/map');

const exit = require('exit');
const assert = require('assert');

const App = require('./lib/App.tsx');
const string = require('./lib/string.cjs');
const stringNoExtension = require('./lib/string');
const guess = require('./lib/guess');

assert.ok(App, 'App not loaded');
assert.equal(string, 'string', 'String not equal to string');
assert.equal(stringNoExtension, 'string', 'stringNoExtension not equal to string');
assert.equal(guess, 'guess', 'guess not equal to guess');

console.log('Success!');

exit(0); // ensure stdout is drained
