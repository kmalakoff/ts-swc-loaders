"use strict";
require("../polyfills.js");
var createSpawnArgs = require("../createSpawnArgs");
var local = +process.versions.node.split(".")[0];
module.exports = function spawnArgs(type, options, major) {
    return createSpawnArgs(type, options, major || local);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }