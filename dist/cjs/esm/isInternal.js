"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return isInternal;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var DIST = new URL("../..", require("url").pathToFileURL(__filename).toString()).href;
var INTERNAL_PATHS = [
    DIST,
    _path.default.resolve(DIST, "..", "node_modules")
];
function isInternal(test) {
    return INTERNAL_PATHS.some(function(x) {
        return test.startsWith(x);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }