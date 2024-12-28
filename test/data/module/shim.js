import 'ts-swc-loaders';

import getopts from 'getopts-compat';
const options = getopts(process.argv, {});
import(options._.pop());
