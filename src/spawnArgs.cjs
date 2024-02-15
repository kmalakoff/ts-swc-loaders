require('./polyfills.cjs');
const processCompat = typeof process === 'undefined' ? require('process') : process;

const major = +processCompat.versions.node.split('.')[0];
const importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';

module.exports = function spawnArgs(type, cmd, args, options) {
  if (type === 'module') {
    if (major >= 18) return ['node', ['--no-warnings=ExperimentalWarning', '--import', importArgs, cmd].concat(args), options];
    const env = Object.assign({ NODE_OPTIONS: '--loader ' + 'ts-swc-loaders' }, options.env || processCompat.env);
    return ['node', ['--no-warnings=ExperimentalWarning', cmd].concat(args), Object.assign({ env: env }, options)];
  }
  // commonjs
  return [cmd, ['--require', 'ts-swc-loaders'].concat(args), options];
};
