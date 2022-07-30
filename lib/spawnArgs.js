require('./polyfills');

module.exports = function spawnArgs(type, cmd, args, options) {
  if (type === 'module') {
    var env = Object.assign({ NODE_OPTIONS: '--loader ' + 'ts-swc-loaders' }, options.env || process.env);
    return [cmd, args, Object.assign({ env: env }, options)];
  }
  // commonjs
  else {
    return [cmd, ['--require', 'ts-swc-loaders'].concat(args), options];
  }
};
