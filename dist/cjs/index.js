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
var _register = require("./cjs/register.js");
var _spawnParamscjs = /*#__PURE__*/ _interop_require_default(require("./spawnParams.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _register.register)();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }