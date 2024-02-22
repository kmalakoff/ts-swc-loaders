"use strict";
var path = require("path");
var DIST = path.resolve(__dirname, "..", "..");
module.exports = function isInternal(test) {
    if (test.startsWith(DIST)) return true;
    if (test.indexOf("/node_modules") >= 0) return true;
    return false;
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }