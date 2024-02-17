import 'core-js/actual/map/index.js';
import 'core-js/actual/symbol/for.js';
import process from 'process';

import assert from 'assert';
import App from './lib/react.tsx';
import string from './lib/string.cjs';

assert.ok(App);
assert.equal(string, 'string');

console.log(`success: ${process.argv[process.argv.length-1]}`);
