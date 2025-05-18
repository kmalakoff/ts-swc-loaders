import path from 'path';
import pirates from 'pirates';

import { constants, createMatcher, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants.js';
import loadTSConfig from '../lib/loadTSConfig.js';

import cache from '../cache.js';

const config = loadTSConfig(process.cwd());
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
const match = createMatcher(config);
const { extensions } = constants;

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

  const key = cache.key(filePath, config);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, config), hash);
  return compiled.code;
}
