const path = require('path');
const url = require('url');
const spawn = require('cross-spawn-cb');
const _pathKey = require('env-path-key');
const exit = require('exit');
const _prepend = require('path-string-prepend');
const which = require('./lib/which');
const spawnParams = require('./spawnParams.js');

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

module.exports = function cli(args, options, cb) {
  options = options || {};

  // look up the full path
  which(args[0], options, (_err, cmd) => {
    // not found, use the original
    if (!cmd) cmd = args[0];

    function callback(err, res) {
      if (cb) return cb(err, res);
      if (err && err.message.indexOf('ExperimentalWarning') < 0) {
        console.log(err.message);
        return exit(err.code || -1);
      }
      exit(0);
    }

    const cwd = options.cwd || process.cwd();
    const env = options.env || process.env;
    const params = spawnParams(type, { stdio: 'inherit', cwd, env, ...options });
    if (options.encoding) delete params.options.stdio;

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
