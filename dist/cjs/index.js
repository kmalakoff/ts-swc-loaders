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
    spawnParams: function() {
        return _spawnParamscjs.default;
    },
    transformSync: function() {
        return _transformSynccjs.default;
    }
});
var _register = require("./cjs/register.js");
var _transformSynccjs = /*#__PURE__*/ _interop_require_default(require("./transformSync.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("./createMatcher.js"));
var _spawnParamscjs = /*#__PURE__*/ _interop_require_default(require("./spawnParams.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _register.register)();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }