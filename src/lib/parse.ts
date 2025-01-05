import path from 'path';
import url from 'url';
import which from 'which';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const loaderCJS = path.join(dist, 'cjs', 'index.cjs.cjs');
const loaderESMBase = path.join(dist, 'esm', 'index.esm.mjs');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;
const js = `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./"));`;

const major = +process.versions.node.split('.')[0];
const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';
const NODE_EXEC_PATH = which.sync(NODE);

import type { ParseResult, SpawnOptions } from '../types';

export default function parse(type: string, command: string, args: string[], options: SpawnOptions = {}): ParseResult {
  if (type === 'commonjs') return { command, args: ['--require', loaderCJS, ...args], options };

  if (major < 18) {
    // https://stackoverflow.com/questions/55778283/how-to-disable-warnings-when-node-is-launched-via-a-global-shell-script
    const env = { ...(options.env || process.env) };
    env.NODE_OPTIONS = `--loader ${loaderESM} ${env.NODE_OPTIONS || ''}`;
    return { command, args, options: { ...options, env } };
  }
  const env = options.env || process.env;
  const execPath = env.NODE || env.npm_node_execpath || NODE_EXEC_PATH;
  const parsed = {
    command: execPath,
    args: path.basename(command) === execPath ? ['--import', js, ...args] : ['--import', js, command, ...args],
    options,
  };
  return parsed;
}
