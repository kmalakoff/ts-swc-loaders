import spawn from 'cross-spawn-cb';
import exit from 'exit';
import resolveBin from 'resolve-bin';
import { moduleRegEx } from './constants.js';
import parse from './parse.js';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

function which(command, callback) {
  moduleRegEx.test(command) ? resolveBin(command, callback) : callback(null, command);
}

export default function cli(args, options, callback) {
  options = options || {};

  // look up the full path
  which(args[0], (_err, command) => {
    const cwd = options.cwd || process.cwd();
    const env = options.env || process.env;
    const parsed = parse(type, command || args[0], args.slice(1), { stdio: 'inherit', cwd, env, ...options });
    spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
      if (callback) return callback(err, res);
      if (err && err.message.indexOf('ExperimentalWarning') < 0) {
        console.log(err.message);
        return exit(-1);
      }
      exit(0);
    });
  });
}
