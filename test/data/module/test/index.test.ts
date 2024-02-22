import exit from 'exit';

// @ts-ignore
import App from './lib/App.tsx';
import string from './lib/string.cjs';
// @ts-ignore
import guess from './lib/guess';

if (!App) throw new Error('App not loaded');
if (string !== 'string') throw new Error('string not equal to string')
if (guess !== 'guess') throw new Error('guess not equal to guess')

console.log('Success!');

exit(0); // ensure stdout is drained
