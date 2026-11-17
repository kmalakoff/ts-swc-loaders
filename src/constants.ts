import fs from 'fs';
import Module from 'module';
import path from 'path';
import { constants as transformConstants } from 'ts-swc-transform';

import { tmpdir } from './compat.ts';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;

// Windows has no uid and its temp folder is already per user.
export const userId: number | undefined = process.geteuid ? process.geteuid() : process.getuid ? process.getuid() : undefined;
export const DEFAULT_CACHE_PATH: string = path.join(tmpdir(), userId === undefined ? 'ts-swc' : `ts-swc-${userId}`);

// The version of `name` that ts-swc-transform resolves: the nearest node_modules/<name> from its folder upward ('' when absent).
function versionFrom(dir: string, name: string): string {
  for (;;) {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, 'node_modules', name, 'package.json'), 'utf8')).version;
    } catch (_err) {
      // not in this folder
    }
    const parent = path.dirname(dir);
    if (parent === dir) return '';
    dir = parent;
  }
}

const transformDir = path.dirname(_require.resolve('ts-swc-transform/package.json'));
// Compiler versions are part of every cache entry's name.
export const COMPILERS: string[] = [`ts-swc-transform@${_require('ts-swc-transform/package.json').version}`].concat(['@swc/core', '@swc/wasm', 'typescript', 'ts-node'].map((name) => `${name}@${versionFrom(transformDir, name)}`));
export const moduleRegEx = /^[^./]|^\.[^./]|^\.\.[^/]/;
export const typeFileRegEx = /\.d\.[cm]?ts$/;
// The TypeScript extensions among ts-swc-transform's full hook list (which also covers .js/.mjs/.cjs/.jsx).
export const typeScriptExtensions: string[] = transformConstants.extensions.filter((ext) => ext.indexOf('ts') >= 0);
