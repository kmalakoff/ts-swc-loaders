require('ts-swc-loaders');

var index = 0;
while (process.argv[index].indexOf('.test.') < 0) index++;
require(process.argv[index]);
