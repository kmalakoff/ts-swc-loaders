"use strict";
var path = require('path');
var swc = require('@swc/core');
var ts = require('typescript');
var swcTranspiler = require('ts-node/transpilers/swc');
module.exports = function transformSync(contents, fileName, config) {
    var parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(config.path));
    var transpile = swcTranspiler.create({
        swc: swc,
        service: {
            config: {
                options: parsed.options
            }
        }
    });
    var res = transpile.transpile(contents, {
        fileName: fileName
    });
    return {
        code: res.outputText,
        map: res.sourceMapText
    };
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }