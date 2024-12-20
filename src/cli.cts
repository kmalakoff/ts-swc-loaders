const path = require('path');
const url = require('url');
const spawn = require('cross-spawn-cb');
const pathKey = require('env-path-key');
const exit = require('exit');
const prepend = require('path-string-prepend');
const which = require('which');
const { spawnParams } = require('./index.js');

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

module.exports = function cli(args, options, cb) {
  options = options || {};
  const cwd = options.cwd || process.cwd();
  const env = { ...process.env };
  const PATH_KEY = pathKey();
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', 'node_modules', '.bin'));
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(process.cwd(), 'node_modules', '.bin'));
  const params = spawnParams(type, { stdio: 'inherit', cwd, env, ...options });
  // biome-ignore lint/performance/noDelete: <explanation>
  if (options.encoding) delete params.options.stdio;

  function callback(err, res) {
    if (cb) return cb(err, res);
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  }

  // look up the full path
  which(args[0], { path: env[PATH_KEY] }, (_err, cmd) => {
    // not found, use the original
    if (!cmd) cmd = args[0];

    // spawn on windows
    const cmdExt = path.extname(cmd);
    if (path.extname(args[0]) !== cmdExt) return spawn(cmd, params.args.concat(args.slice(1)), params.options, callback);

    // relative, use the original
    if (args[0][0] === '.') cmd = args[0];

    // node <= 0.12 didn't take the --require option
    if (major < 12) return spawn(cmd, params.args.concat(args.slice(1)), params.options, callback);

    // send to node
    spawn(process.execPath, params.args.concat([cmd]).concat(args.slice(1)), params.options, callback);
  });
};
