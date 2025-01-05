import spawn, { type SpawnResult } from 'cross-spawn-cb';
import resolveBin from 'resolve-bin-sync';
import { moduleRegEx } from '../constants';
import parse from './parse';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

// https://github.com/yarnpkg/berry/blob/2cf0a8fe3e4d4bd7d4d344245d24a85a45d4c5c9/packages/yarnpkg-pnp/sources/loader/applyPatch.ts#L414-L435
const originalEmit = process.emit;
// @ts-expect-error - TS complains about the return type of originalEmit.apply
process.emit = (name, data, ..._args) => {
  if (name === 'warning' && typeof data === 'object' && data.name === 'ExperimentalWarning' && (data.message.includes('--experimental-loader') || data.message.includes('Custom ESM Loaders is an experimental feature'))) return false;

  return originalEmit.call(process, name, data, ..._args);
};

function which(command) {
  try {
    if (moduleRegEx.test(command)) return resolveBin(command);
  } catch (_err) {}
  return command;
}

export default function worker(command, args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;

  const parsed = parse(type, which(command), args, { stdio: 'inherit', cwd, env, ...options });
  spawn(parsed.command, parsed.args, parsed.options, callback);
}
