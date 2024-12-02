"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "spawnParams", {
    enumerable: true,
    get: function() {
        return _spawnParamscjs.default;
    }
});
_export_star(require("./esm/loaderCurrent.js"), exports);
_export_star(require("./esm/loaderLegacy.js"), exports);
var _spawnParamscjs = /*#__PURE__*/ _interop_require_default(require("./spawnParams.js"));
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }