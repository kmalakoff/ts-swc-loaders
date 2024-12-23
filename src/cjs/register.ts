import path from 'path';
import pirates from 'pirates';
import '../polyfills.cjs';

import { createMatcher, extensions, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants.js';
import Cache from '../lib/Cache.js';
import loadTSConfig from '../lib/loadTSConfig.js';

const cache = new Cache();
const config = loadTSConfig(process.cwd());
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
const match = createMatcher(config);

export function register(_ = {}, hookOpts = {}) {
  return pirates.addHook((code, filePath) => compile(code, filePath), { ...hookOpts, exts: extensions });
}

export function compile(contents, filePath) {
  const ext = path.extname(filePath);

  // filter
  if (!match(filePath)) return contents || ' ';
  if (typeFileRegEx.test(filePath)) return ' ';
  if (ext === '.json') return contents || ' ';
  if (extensions.indexOf(ext) < 0) return contents || ' ';

  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return data.code;
}
