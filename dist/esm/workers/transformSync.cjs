const path = require('path');
const swc = require('@swc/core');
const ts = require('typescript');
const swcTranspiler = require('ts-node/transpilers/swc');
module.exports = function transformSync(contents, fileName, config) {
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(config.path));
    const transpile = swcTranspiler.create({
        swc: swc,
        service: {
            config: {
                options: parsed.options
            }
        }
    });
    const res = transpile.transpile(contents, {
        fileName: fileName
    });
    return {
        code: res.outputText,
        map: res.sourceMapText
    };
};
