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
var _transformSynccjs = /*#__PURE__*/ _interop_require_default(require("../transformSync.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_path.default.resolve(process.cwd(), "tsconfig.json"));
config.config.compilerOptions.module = "CommonJS";
config.config.compilerOptions.target = "ES5";
var match = (0, _createMatcher.default)(config);
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
    if (!match(filePath)) return contents || " ";
    if (typeFileRegEx.test(filePath)) return " ";
    if (_extensions.default.indexOf(ext) < 0) return contents || " ";
    var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
        return (0, _transformSynccjs.default)(contents, filePath, config);
    });
    return data.code;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }