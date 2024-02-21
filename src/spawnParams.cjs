require('./polyfills.cjs');
const processCompat = typeof process === 'undefined' ? require('process') : process;

const major = +processCompat.versions.node.split('.')[0];
// const _importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';

module.exports = function spawnParams(type, options) {
  if (type === 'commonjs') return { args: ['--require', 'ts-swc-loaders'], options };
  // https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options
  // v20.8.0
  // if (major >= 20) return { args: ['--no-warnings=ExperimentalWarning', '--import', importArgs], options };

  // args
  const args = major > 4 ? ['--no-warnings=ExperimentalWarning'] : [];
  // if (major <= 16) args.push('--experimental-modules');

  // options
  const env = options.env || processCompat.env;
  options = { ...(options || {}) };
  options.env = { ...env };
  options.env.NODE_OPTIONS = `--loader ts-swc-loaders${env.NODE_OPTIONS ? ` ${options.env.NODE_OPTIONS}` : ''}`;
  return { args, options };
};
