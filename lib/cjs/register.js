require('../polyfills');
var path = require('path');
var pirates = require('pirates');
var assign = require('just-extend');

var ts = require('ts-constants');

var extensions = require('../extensions');
var needsCompile = require('../needsCompile');
var Cache = require('../cache');

var call = require('node-version-call');
var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var readConfigSync = path.dirname(__dirname) + '/readConfigSync.js';
var transformSync = path.dirname(__dirname) + '/transformSync.js';

var distPath = path.resolve(__dirname, '..');
var modulesPath = path.resolve(__dirname, '..', '..', 'node_modules');

function register(options, hookOpts) {
  options = options || {};

  return pirates.addHook(function (code, filePath) {
    return compile(code, filePath, options);
  }, assign({ exts: extensions }, hookOpts || {}));
}

// lazy create
var config = null;
var cache = null;

function compile(contents, filePath) {
  // skip internals
  if (filePath.startsWith(distPath) || filePath.startsWith(modulesPath)) return contents;

  // lazy create
  if (!config) {
    config = call(version, readConfigSync, path.resolve(process.cwd(), 'tsconfig.json'));

    // overrides for cjs
    // if (major < 12) {
    config.options.module = ts.ModuleKind.CommonJS;
    config.options.target = ts.ScriptTarget.ES5;
    // }
  }
  if (!cache) cache = new Cache();

  // filter
  if (filePath.endsWith('.d.ts')) return ' ';
  if (extensions.indexOf(path.extname(filePath)) < 0) return contents || ' ';
  if (!needsCompile(filePath, config)) return contents || ' ';

  console.log(cache.cachePath(filePath, config.options))

  var data = cache.getOrUpdate(cache.cachePath(filePath, config.options), contents, function () {
    return call(version, transformSync, contents, filePath, config.options);
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
