import exit from 'exit';
import assert from 'assert';

// @ts-ignore
import App from './lib/App.tsx';
import string from './lib/string.cjs';
// @ts-ignore
import stringNoExtension from './lib/string';
// @ts-ignore
import guess from './lib/guess';

assert.ok(App, 'App not loaded');
assert.equal(string, 'string', 'String not equal to string');
assert.equal(stringNoExtension, 'string', 'stringNoExtension not equal to string');
assert.equal(guess, 'guess', 'guess not equal to guess');

console.log('Success!');

exit(0); // ensure stdout is drained
