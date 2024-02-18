#!/usr/bin/env node

var getopts = require('getopts-compat');

var options = getopts(process.argv.slice(2), {
  alias: { require: 'r' },
  stopEarly: true,
});

require(options.require);
process.argv = options._;
require('./' + process.argv.shift());
