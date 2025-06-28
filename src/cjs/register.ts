import path from 'path';
import pirates, { type Options, type RevertFunction } from 'pirates';

import { constants, createMatcher, transformSync } from 'ts-swc-transform';
import cache from '../cache.ts';
import { typeFileRegEx } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';

const config = loadTSConfig(process.cwd());
config.config.compilerOptions.module = 'commonjs';
config.config.compilerOptions.target = 'es5';
const match = createMatcher(config);
const { extensions } = constants;

export function register(_?: unknown, hookOpts?: Options): RevertFunction {
  if (hookOpts === undefined) return pirates.addHook((code, filePath) => compile(code, filePath), { exts: extensions });
  return pirates.addHook((code, filePath) => compile(code, filePath), { ...hookOpts, exts: extensions });
}

export function compile(contents: string, filePath: string): string {
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
