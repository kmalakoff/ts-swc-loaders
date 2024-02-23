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
var _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
var _nodeprocess = /*#__PURE__*/ _interop_require_default(require("node:process"));
var _nodeurl = require("node:url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function toPath(x, context) {
    if (x.startsWith("file://")) return (0, _nodeurl.fileURLToPath)(x);
    if (_nodepath.default.isAbsolute(x)) return x;
    if (x[0] === ".") {
        // biome-ignore lint/complexity/useOptionalChain: <explanation>
        var parentPath = context && context.parentURL ? _nodepath.default.dirname(toPath(context.parentURL)) : _nodeprocess.default.cwd();
        return _nodepath.default.resolve(parentPath, x);
    }
    return x;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }