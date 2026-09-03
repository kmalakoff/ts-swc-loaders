import Module from 'module';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const loaderCJS = path.join(dist, 'cjs', 'index-cjs.js');
const loaderESMBase = path.join(dist, 'esm', 'index-esm.js');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;
const registerHooksBase = path.join(dist, 'esm', 'registerHooks.js');
const registerHooksURL = url.pathToFileURL ? url.pathToFileURL(registerHooksBase).toString() : registerHooksBase;
// Register async hooks with module.register() for import(), and sync hooks with registerHooks() for require()
// Node 22.15+ has module.registerHooks() which works with both import() and require()
const js = `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./")); try { const h = await import("${registerHooksURL}"); h.registerSyncHooks(); } catch (e) {}`;

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE ?? '');
const NODE = isWindows ? 'node.exe' : 'node';

import type { ParseResult, SpawnOptions } from '../types.ts';

export default function parse(type: string, command: string, args: string[], options: SpawnOptions = {}): ParseResult {
  if (type === 'commonjs') return { command, args: ['--require', loaderCJS].concat(args), options };

  // module.register (18.19 / 20.6) is the true boundary for the --import bootstrap: it implies --import.
  // Without it NODE_OPTIONS carries the loader, which survives wrappers that re-spawn node (mocha's bin does).
  if (typeof (Module as { register?: unknown }).register !== 'function') {
    // https://stackoverflow.com/questions/55778283/how-to-disable-warnings-when-node-is-launched-via-a-global-shell-script
    const env = { ...(options.env || process.env) };
    env.NODE_OPTIONS = `--loader ${loaderESM} ${env.NODE_OPTIONS || ''}`;
    // Run the command as an argument to node rather than as an executable: npm only sets the
    // executable bit on bins it links, so an aliased copy losing a bin-name collision has none.
    return {
      command: process.execPath,
      args: path.basename(command) === NODE ? args : [command].concat(args),
      options: { ...options, env },
    };
  }
  const parsed = {
    command: process.execPath,
    args: path.basename(command) === NODE ? ['--import', js].concat(args) : ['--import', js, command].concat(args),
    options,
  };
  return parsed;
}
