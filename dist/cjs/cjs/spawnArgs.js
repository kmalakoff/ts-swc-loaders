"use strict";
require("../polyfills.js");
var createSpawnArgs = require("../createSpawnArgs");
var local = +process.versions.node.split(".")[0];
module.exports = function spawnArgs(type, options, major) {
    return createSpawnArgs(type, options, major || local);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }