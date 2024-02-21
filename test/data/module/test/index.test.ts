import process from 'process';

console.log(process.argv);

import string from './lib/string.cjs';
// @ts-ignore
import App from './lib/react.tsx';

if (string !== 'string') throw new Error('String not equal to string')
if (!App) throw new Error('App not loaded');

console.log('ran successfully');

process.exit(0);
