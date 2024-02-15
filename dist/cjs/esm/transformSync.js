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
var _url = require("url");
var _nodeversioncall = /*#__PURE__*/ _interop_require_default(require("node-version-call"));
var _process = /*#__PURE__*/ _interop_require_default(require("process"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var __dirname = (0, _url.fileURLToPath)(new URL(".", require("url").pathToFileURL(__filename).toString()));
var major = +_process.default.versions.node.split(".")[0];
var version = major >= 14 ? "local" : "lts";
var worker = _path.default.resolve(__dirname, "..", "..", "cjs", "workers", "transformSync.js");
function transformSync(contents, filename, config) {
    return (0, _nodeversioncall.default)(version, worker, contents, filename, config);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}