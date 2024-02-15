"use strict";
var path = require("path");
var swc = require("@swc/core");
var ts = require("typescript");
var swcTranspiler = require("ts-node/transpilers/swc");
module.exports = function transformSync(contents, filename, config) {
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
        fileName: filename
    });
    return {
        code: res.outputText,
        map: res.sourceMapText
    };
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}