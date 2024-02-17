#!/usr/bin/env node

while(process.argv[0] !== 'ts-swc-loaders') process.argv.shift();

require(process.argv.shift())
require('./' + process.argv.shift())
