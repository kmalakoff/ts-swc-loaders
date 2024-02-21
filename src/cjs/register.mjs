import path from 'path';
import pirates from 'pirates';
import '../polyfills.cjs';

import Cache from '../Cache.js';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
import isInternal from './isInternal.cjs';

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
  if (filePath.indexOf('index.test.ts') >= 0) console.log('compile', 1, filePath);
  try {
    // filter
    if (isInternal(filePath)) {
      if (filePath.indexOf('index.test.ts') >= 0) console.log('compile', 22, filePath);
      return contents;
    }
  } catch (err) {
    console.log(err);
    return;
  }
  if (filePath.indexOf('index.test.ts') >= 0) console.log('compile', 2, filePath);
  if (filePath.endsWith('.d.ts')) return ' ';
  if (filePath.indexOf('index.test.ts') >= 0) console.log('compile', 3, filePath);
  if (extensions.indexOf(path.extname(filePath)) < 0) return contents || ' ';
  if (!match(filePath)) return contents || ' ';

  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return data.code;
}
