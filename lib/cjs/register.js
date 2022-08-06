require('../polyfills');
var path = require('path');
var pirates = require('pirates');

var ts = require('ts-constants');

var Cache = require('../Cache');
var extensions = require('../extensions');
var needsCompile = require('../needsCompile');
var readConfigSync = require('../readConfigSync');
var transformSync = require('../transformSync');

var INTERNAL_PATHS = [path.resolve(__dirname, '..'), path.resolve(__dirname, '..', '..', 'node_modules')];
function isInternal(x) {
  return INTERNAL_PATHS.some(function (y) {
    return x.startsWith(y);
  });
}

var cache = new Cache();
var config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));
config.options.module = ts.ModuleKind.CommonJS;
config.options.target = ts.ScriptTarget.ES5;

function register(options, hookOpts) {
  options = options || {};
  return pirates.addHook(function (code, filePath) {
    return compile(code, filePath, options);
  }, Object.assign({ exts: extensions }, hookOpts || {}));
}

function compile(contents, filePath) {
  // filter
  if (isInternal(filePath)) return contents;
  if (filePath.endsWith('.d.ts')) return ' ';
  if (extensions.indexOf(path.extname(filePath)) < 0) return contents || ' ';
  if (!needsCompile(filePath, config)) return contents || ' ';

  var data = cache.getOrUpdate(cache.cachePath(filePath, config.options), contents, function () {
    return transformSync(contents, filePath, config.options);
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
