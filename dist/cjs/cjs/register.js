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
var _tsswctransform = require("ts-swc-transform");
var _extensions = /*#__PURE__*/ _interop_require_default(require("../extensions.js"));
var _Cache = /*#__PURE__*/ _interop_require_default(require("../lib/Cache.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../lib/loadTSConfig.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(process.cwd());
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
var match = (0, _tsswctransform.createMatcher)(config);
var typeFileRegEx = /^[^.]+\.d\.(.*)$/;
function register(options, hookOpts) {
    options = options || {};
    return _pirates.default.addHook(function(code, filePath) {
        return compile(code, filePath, options);
    }, Object.assign({
        exts: _extensions.default
    }, hookOpts || {}));
}
function compile(contents, filePath) {
    var ext = _path.default.extname(filePath);
    // filter
    if (!match(filePath)) return contents || ' ';
    if (typeFileRegEx.test(filePath)) return ' ';
    if (_extensions.default.indexOf(ext) < 0) return contents || ' ';
    var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
        return (0, _tsswctransform.transformSync)(contents, filePath, config);
    });
    return data.code;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }