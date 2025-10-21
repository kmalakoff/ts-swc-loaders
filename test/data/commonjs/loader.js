#!/usr/bin/env node

require("ts-swc-loaders");

const getopts = require("getopts-compat");
const options = getopts(process.argv, {});
require(options._.pop());
