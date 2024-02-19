require('./polyfills.cjs');
const processCompat = typeof process === 'undefined' ? require('process') : process;

const major = +processCompat.versions.node.split('.')[0];
const importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';

module.exports = function spawnParams(type, options) {
  if (type === 'commonjs') return { args: ['--require', 'ts-swc-loaders'], options };
  if (major >= 18) return { args: ['--no-warnings=ExperimentalWarning', '--import', importArgs], options };

  const env = options.env || processCompat.env;
  const spawnOptions = { ...(options || {}) };
  spawnOptions.env = { ...env };
  spawnOptions.env.NODE_OPTIONS = `--loader ts-swc-loaders${env.NODE_OPTIONS ? ` ${spawnOptions.env.NODE_OPTIONS}` : ''}`;
  return { args: major > 4 ? ['--no-warnings=ExperimentalWarning'] : [], options: spawnOptions };
};
