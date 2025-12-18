import spawn, { type SpawnCallback, type SpawnOptions } from 'cross-spawn-cb';
import resolveBin from 'resolve-bin-sync';
import { moduleRegEx } from '../constants.ts';
import parse from './parse.ts';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

function which(command: string): string {
  try {
    if (moduleRegEx.test(command)) return resolveBin(command);
  } catch (_err) {}
  return command;
}

export default function worker(command: string, args: string[], options: SpawnOptions, callback: SpawnCallback): void {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;

  const parsed = parse(type, which(command), args, { cwd, env, ...options });
  spawn(parsed.command, parsed.args, parsed.options, callback);
}
