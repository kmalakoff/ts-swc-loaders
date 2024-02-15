"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    compile: function() {
        return compile;
    },
    register: function() {
        return register;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _pirates = /*#__PURE__*/ _interop_require_default(require("pirates"));
require("../polyfills.js");
var _Cache = /*#__PURE__*/ _interop_require_default(require("../Cache.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("../createMatcher.js"));
var _extensions = /*#__PURE__*/ _interop_require_default(require("../extensions.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../loadTSConfig.js"));
var _transformSync = /*#__PURE__*/ _interop_require_default(require("./transformSync.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var INTERNAL_PATHS = [
    _path.default.resolve(__dirname, ".."),
    _path.default.resolve(__dirname, "..", "..", "node_modules")
];
function isInternal(x) {
    return INTERNAL_PATHS.some(function(y) {
        return x.startsWith(y);
    });
}
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_path.default.resolve(process.cwd(), "tsconfig.json"));
config.config.compilerOptions.module = "CommonJS";
config.config.compilerOptions.target = "ES5";
var match = (0, _createMatcher.default)(config);
function register(options, hookOpts) {
    options = options || {};
    return _pirates.default.addHook(function(code, filePath) {
        return compile(code, filePath, options);
    }, Object.assign({
        exts: _extensions.default
    }, hookOpts || {}));
}
function compile(contents, filePath) {
    // filter
    if (isInternal(filePath)) return contents;
    if (filePath.endsWith(".d.ts")) return " ";
    if (_extensions.default.indexOf(_path.default.extname(filePath)) < 0) return contents || " ";
    if (!match(filePath)) return contents || " ";
    var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
        return (0, _transformSync.default)(contents, filePath, config);
    });
    return data.code;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}