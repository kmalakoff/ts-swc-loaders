import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import packageRoot from './lib/packageRoot.js';

const _major = +process.versions.node.split('.')[0];
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = packageRoot(__dirname);

const loaderCJS = path.resolve(root, 'dist', 'cjs', 'index.cjs.js');
const loaderESM = path.resolve(root, 'dist', 'esm', 'index.esm.mjs');
const _importArgs = `data:text/javascript,import { register } from "node:module"; register("ts-swc-loaders", "file:////${loaderESM}");`;

import type { ParseResult, SpawnOptions } from './types.js';

export default function parse(type: string, command: string, args: string[], options_: SpawnOptions): ParseResult {
  const options = { env: process.env, ...options_ };
  const parsed = spawn._parse(command, args, options);
  if (type === 'commonjs') {
    delete parsed.options.env.NODE_OPTIONS;
    parsed.args = ['--require', loaderCJS].concat(parsed.args);
    return parsed;
  }

  // if (major > 4) parsed.args.unshift('--no-warnings=ExperimentalWarning');

  // https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options
  // if (major >= 18) {
  //   parsed.args = ['--import', importArgs].concat(parsed.args);
  //   console.log(parsed)
  //   return parsed;
  // }

  parsed.options.env.NODE_OPTIONS = `--loader ${loaderESM}${options.env.NODE_OPTIONS ? ` ${options.env.NODE_OPTIONS}` : ''}`;
  return parsed;
}
