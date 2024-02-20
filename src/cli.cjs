const exit = require('exit');
const path = require('path');
const spawn = require('cross-spawn-cb');
const pathKey = require('env-path-key');
const prepend = require('path-string-prepend');
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

  spawn(args[0], params.args.concat(args.slice(1)), params.options, (err) => {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
};
