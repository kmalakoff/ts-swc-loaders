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
        return _spawnArgscjs.default;
    },
    transformSync: function() {
        return _transformSynccjs.default;
    }
});
var _register = require("./cjs/register.js");
var _transformSynccjs = /*#__PURE__*/ _interop_require_default(require("./cjs/transformSync.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("./createMatcher.js"));
var _spawnArgscjs = /*#__PURE__*/ _interop_require_default(require("./cjs/spawnArgs.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _register.register)();

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}