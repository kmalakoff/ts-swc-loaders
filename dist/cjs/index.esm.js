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
    createMatcher: function() {
        return _createMatcher.default;
    },
    spawnArgs: function() {
        return _spawnArgs.default;
    },
    transformSync: function() {
        return _transformSync.default;
    }
});
_export_star(require("./esm/loaderCurrent.js"), exports);
_export_star(require("./esm/loaderLegacy.js"), exports);
var _transformSync = /*#__PURE__*/ _interop_require_default(require("./esm/transformSync.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("./createMatcher.js"));
var _spawnArgs = /*#__PURE__*/ _interop_require_default(require("./esm/spawnArgs.js"));
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }