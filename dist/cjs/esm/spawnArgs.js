"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return spawnArgs;
    }
});
var _process = /*#__PURE__*/ _interop_require_default(require("process"));
var _createSpawnArgs = /*#__PURE__*/ _interop_require_default(require("../createSpawnArgs.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var local = +_process.default.versions.node.split(".")[0];
function spawnArgs(type, options, major) {
    return (0, _createSpawnArgs.default)(type, options, major || local);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }