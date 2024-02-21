"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return loadTSConfig;
    }
});
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function loadTSConfig(path) {
    var config = _gettsconfigcompat.default.getTsconfig(path);
    if (!config || !config.path) {
        console.log("tsconfig.json not found at: ".concat(path));
        config = {};
    }
    config.path = config.path || "";
    config.config = config.config || {};
    config.config.compilerOptions = config.config.compilerOptions || {};
    config.config.include = config.config.include || [];
    return config;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }