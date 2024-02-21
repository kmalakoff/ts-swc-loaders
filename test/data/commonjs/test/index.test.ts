require('core-js/actual/symbol/for');
require('core-js/actual/map');

// @ts-ignore
import App from './lib/react.tsx';
import string from './lib/string.cjs';

if (!App) throw new Error('App not loaded');
if (string !== 'string') throw new Error('String not equal to string')

console.log('ran successfully');

process.exit(0);
