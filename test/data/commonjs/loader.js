var getopts = require('getopts-compat');

var index = process.argv.indexOf(__filename);
if (index>0) process.argv = process.argv.slice(index+1);
index = process.argv.indexOf(__filename.substring(0, __filename.lastIndexOf('.')));
if (index>0) process.argv = process.argv.slice(index+1);

var options = getopts(process.argv, {
  alias: { require: 'r' },
  stopEarly: true,
});

if (options.require) require(options.require);

process.argv = options._;
require(process.argv.shift());

// require('ts-swc-loaders');

// var index = 0;
// while (process.argv[index].indexOf('.test.') < 0) index++;
// require(process.argv[index]);
