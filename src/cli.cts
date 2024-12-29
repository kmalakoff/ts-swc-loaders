const spawn = require('cross-spawn-cb');
const exit = require('exit');
const which = require('module-which');
const parse = require('./parse.js');

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

module.exports = function cli(args, options, callback) {
  options = options || {};

  // look up the full path
  which(args[0], options, (_err, command) => {
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
};