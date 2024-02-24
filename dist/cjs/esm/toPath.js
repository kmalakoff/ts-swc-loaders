"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return toPath;
    }
});
var _nodefs = /*#__PURE__*/ _interop_require_default(require("node:fs"));
var _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
var _nodeprocess = /*#__PURE__*/ _interop_require_default(require("node:process"));
var _nodeurl = require("node:url");
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
var _packageUp = /*#__PURE__*/ _interop_require_default(require("./packageUp.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
function toPath(x, context) {
    if (x.startsWith("file://")) return (0, _nodeurl.fileURLToPath)(x);
    if (_nodepath.default.isAbsolute(x)) return x;
    if (x[0] === ".") {
        // biome-ignore lint/complexity/useOptionalChain: <explanation>
        var parentPath = context && context.parentURL ? _nodepath.default.dirname(toPath(context.parentURL)) : _nodeprocess.default.cwd();
        return _nodepath.default.resolve(parentPath, x);
    }
    if (moduleRegEx.test(x)) {
        // biome-ignore lint/complexity/useOptionalChain: <explanation>
        var parentPath1 = context && context.parentURL ? _nodepath.default.dirname(toPath(context.parentURL)) : _nodeprocess.default.cwd();
        var main = _resolve.default.sync(x, {
            basedir: parentPath1,
            extensions: [
                ".js",
                ".json",
                ".node",
                ".mjs"
            ]
        });
        var pkg = (0, _packageUp.default)(main);
        if (!pkg || !pkg.json.module) return main;
        // try resolving as a module
        var modulePath = _nodepath.default.resolve(_nodepath.default.dirname(pkg.path), pkg.json.module);
        if (pkg.json.name === x) return modulePath; // the module
        // a relative path. Only accept if it doesn't break the relative naming and it exists
        var mainPath = _nodepath.default.resolve(_nodepath.default.dirname(pkg.path), pkg.json.main);
        var moduleResolved = _nodepath.default.resolve(modulePath, _nodepath.default.relative(mainPath, main));
        return moduleResolved.indexOf(x.replace(pkg.json.name, "")) < 0 || !_nodefs.default.existsSync(moduleResolved) ? main : moduleResolved;
    }
    return x;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }