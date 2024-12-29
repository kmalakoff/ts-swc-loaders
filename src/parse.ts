import path from 'path';
import url from 'url';
import moduleRoot from 'module-root-sync';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);
const loaderCJS = path.join(root, 'dist', 'cjs', 'index.cjs.js');
const loaderESMBase = path.join(root, 'dist', 'esm', 'index.esm.mjs');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;
const js = `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./"));`;

const major = +process.versions.node.split('.')[0];
const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';

import type { ParseResult, SpawnOptions } from './types.js';

export default function parse(type: string, command: string, args: string[], options: SpawnOptions = {}): ParseResult {
  if (type === 'commonjs') return { command, args: ['--require', loaderCJS, ...args], options };

  if (major < 18) {
    // https://stackoverflow.com/questions/55778283/how-to-disable-warnings-when-node-is-launched-via-a-global-shell-script
    const env = { ...(options.env || process.env) };
    env.NODE_OPTIONS = `--loader ${loaderESM} ${env.NODE_OPTIONS || ''}`;
    return { command, args, options: { ...options, env } };
  }
  const env = options.env || process.env;
  const node = env.NODE || env.npm_node_execpath || NODE;
  const newArgs = command === node ? ['--import', js, ...args] : ['--import', js, command, ...args];
  const parsed = { command: node, args: newArgs, options };
  return parsed;
}
