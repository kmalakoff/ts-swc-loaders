require('../polyfills');
var path = require('path');
var pirates = require('pirates');
var getTS = require('get-tsconfig-compat');

var Cache = require('../Cache');
var createMatcher = require('../createMatcher.js');
var extensions = require('../extensions');
var transformSync = require('../transformSync');

var INTERNAL_PATHS = [path.resolve(__dirname, '..'), path.resolve(__dirname, '..', '..', 'node_modules')];
function isInternal(x) {
  return INTERNAL_PATHS.some(function (y) {
    return x.startsWith(y);
  });
}

var cache = new Cache();
var config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
var match = createMatcher(config);

function register(options, hookOpts) {
  options = options || {};
  return pirates.addHook(
    function (code, filePath) {
      return compile(code, filePath, options);
    },
    Object.assign({ exts: extensions }, hookOpts || {})
  );
}

function compile(contents, filePath) {
  // filter
  if (isInternal(filePath)) return contents;
  if (filePath.endsWith('.d.ts')) return ' ';
  if (extensions.indexOf(path.extname(filePath)) < 0) return contents || ' ';
  if (!match(filePath)) return contents || ' ';

  var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function () {
    return transformSync(contents, filePath, config);
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
