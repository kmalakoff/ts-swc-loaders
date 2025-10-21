import path from 'node:path';
import pirates, { type Options, type RevertFunction } from 'pirates';

import match from 'test-match';
import { constants, transformSync } from 'ts-swc-transform';
import cache from '../cache.ts';
import { typeFileRegEx } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';

const tsconfig = loadTSConfig(process.cwd());
tsconfig.config.compilerOptions.module = 'commonjs';
tsconfig.config.compilerOptions.target = 'es5';
const matcher = match({
  cwd: path.dirname(tsconfig.path),
  include: tsconfig.config.include as string[],
  exclude: tsconfig.config.exclude as string[],
});
const { extensions } = constants;

export function register(_?: unknown, hookOpts?: Options): RevertFunction {
  if (hookOpts === undefined)
    return pirates.addHook((code, filePath) => compile(code, filePath), {
      exts: extensions,
    });
  return pirates.addHook((code, filePath) => compile(code, filePath), {
    ...hookOpts,
    exts: extensions,
  });
}

export function compile(contents: string, filePath: string): string {
  const ext = path.extname(filePath);

  // filter
  if (!matcher(filePath)) return contents || ' ';
  if (typeFileRegEx.test(filePath)) return ' ';
  if (ext === '.json') return contents || ' ';
  if (extensions.indexOf(ext) < 0) return contents || ' ';

  const key = cache.key(filePath, tsconfig);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, tsconfig), hash);
  return compiled.code;
}
