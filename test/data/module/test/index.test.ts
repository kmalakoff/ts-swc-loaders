import exit from 'exit';

// @ts-ignore
import App from './lib/react.tsx';
import string from './lib/string.cjs';

if (!App) throw new Error('App not loaded');
if (string !== 'string') throw new Error('String not equal to string')

console.log('Success!');

exit(0); // ensure stdout is drained
