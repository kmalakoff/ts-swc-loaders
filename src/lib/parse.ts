import Module from 'module';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const loaderCJS = path.join(dist, 'cjs', 'index-cjs.js');
const loaderESMBase = path.join(dist, 'esm', 'index-esm.js');
const loaderESM = url.pathToFileURL ? url.pathToFileURL(loaderESMBase).toString() : loaderESMBase;
// tsds build mirrors src/, so src/esm/registerHooks.ts lands at dist/esm/esm/registerHooks.js.
const registerHooksBase = path.join(dist, 'esm', 'esm', 'registerHooks.js');
const registerHooksURL = url.pathToFileURL ? url.pathToFileURL(registerHooksBase).toString() : registerHooksBase;
const [nodeMajor, nodeMinor, nodePatch] = process.versions.node.split('.').map(Number);
// Node's own registerHooks cannot serve require(esm) of a builtin until 22.22.3, and corrupts the
// async chain when both are registered. Reproduced with no-op hooks on stock Node.
const registerHooksUnreliable = nodeMajor === 22 && ((nodeMinor >= 15 && nodeMinor <= 21) || (nodeMinor === 22 && nodePatch < 3));

// Only the async chain injects the json import attribute, so it always registers; the sync hooks
// ride alongside it to cover require().
const js = registerHooksUnreliable
  ? `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./"));`
  : `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("${loaderESM}", pathToFileURL("./")); try { const h = await import("${registerHooksURL}"); h.registerSyncHooks(); } catch (e) { console.error("ts-swc-loaders: sync hooks not registered:", e && e.message); }`;

// A command that already IS the node executable must not also be handed to node as a script.
// Windows spells it node.exe / node.cmd and matches filenames case-insensitively (cross-spawn-cb's parse).
const NODES = ['node', 'node.exe', 'node.cmd'];
function isNode(command: string): boolean {
  return NODES.indexOf(path.basename(command).toLowerCase()) >= 0;
}

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
      args: isNode(command) ? args : [command].concat(args),
      options: { ...options, env },
    };
  }
  let importArgs = isNode(command) ? ['--import', js].concat(args) : ['--import', js, command].concat(args);
  // The pirates register covers require() of TypeScript wherever the sync hooks cannot.
  const hasRequireModule = !!process.features.require_module;
  const hasReliableRegisterHooks = typeof (Module as { registerHooks?: unknown }).registerHooks === 'function' && !registerHooksUnreliable;
  if (hasRequireModule && !hasReliableRegisterHooks) importArgs = ['--require', loaderCJS].concat(importArgs);

  return {
    command: process.execPath,
    args: importArgs,
    options,
  };
}
