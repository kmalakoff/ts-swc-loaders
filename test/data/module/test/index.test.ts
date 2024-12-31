import assert from 'assert';
import exit from 'exit';

// @ts-ignore
import App from './lib/App.tsx';
// @ts-ignore
import guess from './lib/guess';
// @ts-ignore
import stringNoExtension from './lib/string';
import string from './lib/string.cjs';

assert.ok(App, 'App not loaded');
assert.equal(string, 'string', 'String not equal to string');
assert.equal(stringNoExtension, 'string', 'stringNoExtension not equal to string');
assert.equal(guess, 'guess', 'guess not equal to guess');

console.log('Success!');

exit(0); // ensure stdout is drained
