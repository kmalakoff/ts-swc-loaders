import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const loaderCJS = path.join(dist, 'cjs', 'index-cjs.js');
const loaderESMBase = path.join(dist, 'esm', 'index-esm.js');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;
const js = `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./"));`;

const major = +process.versions.node.split('.')[0];
const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';

import type { ParseResult, SpawnOptions } from '../types.js';

export default function parse(type: string, command: string, args: string[], options: SpawnOptions = {}): ParseResult {
  if (type === 'commonjs') return { command, args: ['--require', loaderCJS].concat(args), options };

  if (major <= 16) {
    // https://stackoverflow.com/questions/55778283/how-to-disable-warnings-when-node-is-launched-via-a-global-shell-script
    const env = { ...(options.env || process.env) };
    env.NODE_OPTIONS = `--loader ${loaderESM} ${env.NODE_OPTIONS || ''}`;
    return { command, args, options: { ...options, env } };
  }
  const parsed = {
    command: process.execPath,
    args: path.basename(command) === NODE ? ['--import', js].concat(args) : ['--import', js, command].concat(args),
    options,
  };
  return parsed;
}
