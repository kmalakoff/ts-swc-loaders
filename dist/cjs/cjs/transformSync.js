"use strict";
var path = require("path");
var major = +process.versions.node.split(".")[0];
var version = major >= 14 ? "local" : "lts";
var worker = path.resolve(__dirname, "..", "workers", "transformSync.js");
var call = null; // break dependencies
module.exports = function transformSync(contents, filename, config) {
    if (!call) call = require("node-version-call"); // break dependencies
    return call(version, worker, contents, filename, config);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}