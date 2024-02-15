"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return transformSync;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = +process.versions.node.split(".")[0];
var version = major >= 14 ? "local" : "lts";
var worker = _path.default.resolve(__dirname, "..", "workers", "transformSync.js");
var call = null; // break dependencies
function transformSync(contents, filename, config) {
    if (!call) call = require("node-version-call"); // break dependencies
    return call(version, worker, contents, filename, config);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}