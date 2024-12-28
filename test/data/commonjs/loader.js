#!/usr/bin/env node

require('ts-swc-loaders');

var getopts = require('getopts-compat');
var options = getopts(process.argv, {});
require(options._.pop());
