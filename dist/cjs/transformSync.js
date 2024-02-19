"use strict";
var path = require("path");
var major = +process.versions.node.split(".")[0];
var version = major >= 14 ? "local" : "lts";
var worker = path.resolve(__dirname, "workers", "transformSync.js");
var call = null; // break dependencies
module.exports = function transformSync(contents, filename, config) {
    if (!call) call = require("node-version-call"); // break dependencies
    return call(version, worker, contents, filename, config);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }