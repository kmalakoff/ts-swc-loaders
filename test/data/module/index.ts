import process from 'process';

import assert from 'assert';
// @ts-ignore
import App from './lib/react.tsx';
import string from './lib/string.cjs';

assert.ok(App);
assert.equal(string, 'string');

console.log(`success: ${process.argv[process.argv.length-1]}`);
