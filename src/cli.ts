import spawn from 'cross-spawn-cb';
import exit from 'exit';
import resolveBin from 'resolve-bin-sync';
import { moduleRegEx } from './constants';
import parse from './parse';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

function which(command) {
  try {
    if (moduleRegEx.test(command)) return resolveBin(command);
  } catch (_err) {}
  return command;
}

export default function cli(args, options, callback) {
  options = options || {};
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;

  const parsed = parse(type, which(args[0]), args.slice(1), { stdio: 'inherit', cwd, env, ...options });
  spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
    if (callback) return callback(err, res);
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(-1);
    }
    exit(0);
  });
}
