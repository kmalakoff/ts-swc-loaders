import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);
const loaderCJS = path.join(root, 'dist', 'cjs', 'index.cjs.js');
const loaderESMBase = path.join(root, 'dist', 'esm', 'index.esm.mjs');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;

import type { ParseResult, SpawnOptions } from './types.js';

export default function parse(type: string, command: string, args: string[], options_: SpawnOptions = {}): ParseResult {
  const options = { ...options_, env: options_.env || process.env };
  let preArgs = [];
  if (type === 'commonjs') preArgs = ['--require', loaderCJS];
  // else if (+process.versions.node.split('.')[0] >= 18) {
  //   const js = `import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./"));`
  //   preArgs = [`--import'data:text/javascript,${js}'`];
  // }
  else {
    options.env = { ...options.env };
    options.env.NODE_OPTIONS = options.env.NODE_OPTIONS ? `--loader ${loaderESM} ${options.env.NODE_OPTIONS}` : `--loader ${loaderESM}`;
  }
  const parsed = spawn._parse(command, [], options);
  parsed.args = [...parsed.args, ...preArgs, ...args];
  // console.log(`${[parsed.command].concat(parsed.args).join(' ')} env: ${options.env.NODE_OPTIONS}`);
  return parsed;
}
