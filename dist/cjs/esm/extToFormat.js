"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return extToFormat;
    }
});
var EXT_TO_FORMAT = {
    '.json': 'json',
    '.mjs': 'module',
    '.mts': 'module',
    '.cjs': 'commonjs',
    '.cts': 'commonjs'
};
function extToFormat(ext) {
    return EXT_TO_FORMAT[ext];
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }