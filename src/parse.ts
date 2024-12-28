import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import packageRoot from './lib/packageRoot.js';

const major = +process.versions.node.split('.')[0];
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = packageRoot(__dirname);

const loaderCJS = path.resolve(root, 'dist', 'cjs', 'index.cjs.js');
const loaderESM = !url.pathToFileURL || url.pathToFileURL(path.resolve(root, 'dist', 'esm', 'index.esm.mjs'));
// const importArgs = `data:text/javascript,import { register } from "node:module"; register("ts-swc-loaders", "${loaderESM}");`;

import type { ParseResult, SpawnOptions } from './types.js';

export default function parse(type: string, command: string, args: string[], options_: SpawnOptions): ParseResult {
  const options = { env: process.env, ...options_ };
  const parsed = spawn._parse(command, args, options);
  if (type === 'commonjs') {
    delete parsed.options.env.NODE_OPTIONS;
    parsed.args = ['--require', loaderCJS].concat(parsed.args);
    return parsed;
  }

  // https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options
  // v20.8.0
  // if (major >= 18) return { args: ['--no-warnings=ExperimentalWarning', '--import', importArgs], options };

  // if (major <= 16) parsed.args.unshift('--experimental-modules');
  if (major > 4) parsed.args.unshift('--no-warnings=ExperimentalWarning');
  parsed.options.env.NODE_OPTIONS = `--loader ${loaderESM}${options.env.NODE_OPTIONS ? ` ${options.env.NODE_OPTIONS}` : ''}`;
  return parsed;
}
