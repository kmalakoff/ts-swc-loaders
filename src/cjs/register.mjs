import path from 'path';
import pirates from 'pirates';
import '../polyfills.cjs';

import Cache from '../Cache.js';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';

const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
const match = createMatcher(config);

export function register(options, hookOpts) {
  options = options || {};
  return pirates.addHook((code, filePath) => compile(code, filePath, options), Object.assign({ exts: extensions }, hookOpts || {}));
}

export function compile(contents, filePath) {
  // filter
  if (!match(filePath)) return contents || ' ';
  if (filePath.endsWith('.d.ts')) return ' ';
  if (extensions.indexOf(path.extname(filePath)) < 0) return contents || ' ';

  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return data.code;
}
