import spawn from 'cross-spawn-cb';
import resolveBin from 'resolve-bin-sync';
import { moduleRegEx } from '../constants';
import parse from './parse';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

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
