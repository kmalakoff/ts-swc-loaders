import process from 'node:process';

import 'ts-swc-loaders';

var index = 0;
while (process.argv[index].indexOf('.test.') < 0 && index < process.argv.length) index++;
import(process.argv[index]);
