"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return createMatcher;
    }
});
var _minimatch = /*#__PURE__*/ _interop_require_default(require("minimatch"));
var _pathposix = /*#__PURE__*/ _interop_require_default(require("path-posix"));
var _slash = /*#__PURE__*/ _interop_require_default(require("slash"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createMatcher(config) {
    var configPath = _pathposix.default.dirname((0, _slash.default)(config.path));
    function matchFn(condition) {
        var pattern = (0, _slash.default)(condition);
        if (!_pathposix.default.isAbsolute(pattern) && !pattern.startsWith("*")) pattern = _pathposix.default.join(configPath, pattern);
        return function match(filePath) {
            return filePath.startsWith(pattern) || (0, _minimatch.default)(filePath, pattern);
        };
    }
    var includes = (config.config.include || []).map(matchFn);
    var excludes = (config.config.exclude || []).map(matchFn);
    return function matcher(filePath) {
        if (filePath.endsWith(".json")) return false;
        filePath = (0, _slash.default)(filePath);
        for(var i = 0; i < excludes.length; ++i){
            if (excludes[i](filePath)) return false;
        }
        for(var j = 0; j < includes.length; ++j){
            if (includes[j](filePath)) return true;
        }
        return !includes.length;
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }