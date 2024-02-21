"use strict";
var path = require("path");
var DIST = path.resolve(__dirname, "..", "..");
var INTERNAL_PATHS = [
    DIST,
    path.resolve(DIST, "..", "node_modules")
];
module.exports = function isInternal(test) {
    try {
        console.log("isInternal", INTERNAL_PATHS, test);
        return INTERNAL_PATHS.some(function(x) {
            return test.startsWith(x);
        });
    } catch (err) {
        console.log(err);
        return false;
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }