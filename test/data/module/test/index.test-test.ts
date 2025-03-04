import assert from 'assert';
import exit from 'exit';

// @ts-ignore
import App from './lib/App.js';
// @ts-ignore
import guess from './lib/guess';
// @ts-ignore
import string from './lib/string.cjs';

assert.ok(App, 'App not loaded');
assert.equal(string, 'string', 'String not equal to string');
assert.equal(guess, 'guess', 'guess not equal to guess');

console.log('Success!');

exit(0); // ensure stdout is drained
