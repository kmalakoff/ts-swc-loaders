import path from 'path';
import pirates from 'pirates';
import process from 'process';
import '../polyfills.cjs';

import { createMatcher, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants.js';
import extensions from '../extensions.mjs';
import Cache from '../lib/Cache.mjs';
import loadTSConfig from '../lib/loadTSConfig.mjs';

const cache = new Cache();
const config = loadTSConfig(process.cwd());
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
const match = createMatcher(config);

export function register(options, hookOpts) {
  options = options || {};
  return pirates.addHook((code, filePath) => compile(code, filePath, options), Object.assign({ exts: extensions }, hookOpts || {}));
}

export function compile(contents, filePath) {
  const ext = path.extname(filePath);

  // filter
  if (!match(filePath)) return contents || ' ';
  if (typeFileRegEx.test(filePath)) return ' ';
  if (extensions.indexOf(ext) < 0) return contents || ' ';

  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return data.code;
}
