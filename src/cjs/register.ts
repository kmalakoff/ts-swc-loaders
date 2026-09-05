import path from 'path';
import pirates, { type Options, type RevertFunction } from 'pirates';

import match from 'test-match';
import { constants, transformSync } from 'ts-swc-transform';
import cache from '../cache.ts';
import { typeFileRegEx, typeScriptExtensions } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';

// Below Node 12 this register is the only transform, so it still has to downlevel .js/.mjs/.cjs;
// above it the bootstrap's import() chain already covers those.
const legacyFullTransform = +process.versions.node.split('.')[0] < 12;
const exts = legacyFullTransform ? constants.extensions : typeScriptExtensions;

const tsconfig = loadTSConfig(process.cwd());
if (!tsconfig.config.compilerOptions) tsconfig.config.compilerOptions = {};
tsconfig.config.compilerOptions.module = 'commonjs';
// es5 downlevels const to var, which the dual `const __dirname = ...` idiom needs: Node's CJS
// wrapper already binds __dirname, and re-declaring it with const throws where var does not.
tsconfig.config.compilerOptions.target = 'es5';
const matcher = match({
  cwd: path.dirname(tsconfig.path),
  include: tsconfig.config.include as string[],
  exclude: tsconfig.config.exclude as string[],
});

export function register(_?: unknown, hookOpts?: Options): RevertFunction {
  if (hookOpts === undefined)
    return pirates.addHook((code, filePath) => compile(code, filePath), {
      exts,
    });
  return pirates.addHook((code, filePath) => compile(code, filePath), {
    ...hookOpts,
    exts,
  });
}

export function compile(contents: string, filePath: string): string {
  const ext = path.extname(filePath);

  // filter
  if (!matcher(filePath)) return contents || ' ';
  if (typeFileRegEx.test(filePath)) return ' ';
  if (exts.indexOf(ext) < 0) return contents || ' ';

  const key = cache.key(filePath, tsconfig);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, tsconfig), hash);
  return compiled.code;
}
