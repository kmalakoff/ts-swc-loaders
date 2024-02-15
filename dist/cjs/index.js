"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "spawnArgs", {
    enumerable: true,
    get: function() {
        return _spawnArgscjs.default;
    }
});
var _register = require("./cjs/register.js");
var _spawnArgscjs = /*#__PURE__*/ _interop_require_default(require("./spawnArgs.js"));
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