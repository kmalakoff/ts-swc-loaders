const exit = require('exit');
const path = require('path');
const spawn = require('cross-spawn-cb');
const pathKey = require('env-path-key');
const prepend = require('path-string-prepend');
const once = require('call-once-fn');
const spawnParams = require('./index.mjs').spawnParams;

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

module.exports = function cli(args, options) {
  const cwd = process.cwd();
  const env = { ...process.env };
  const PATH_KEY = pathKey();
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', 'node_modules', '.bin'));
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(process.cwd(), 'node_modules', '.bin'));
  const params = spawnParams(type, { stdio: 'inherit', cwd, env, ...(options || {}) });

  const callback = once((err) => {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });

  if (params.options.NODE_OPTIONS || params.args[0] === '--require') {
    spawn(args[0], params.args.concat(args.slice(1)), params.options, callback);
  } else {
    require('which')(args[0], { path: env[PATH_KEY] })
      .then((cmd) => {
        spawn('node', params.args.concat([cmd]).concat(args.slice(1)), params.options, callback);
      })
      .catch(callback);
  }
};
