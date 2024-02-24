"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return fileType;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _packageUp = /*#__PURE__*/ _interop_require_default(require("./packageUp.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isEntry(filePath, pkg, key) {
    if (pkg.json[key] === undefined) return false;
    var modulePath = _path.default.resolve(pkg.dir, pkg.json[key]);
    if (filePath === modulePath) return true;
    var moduleDir = _path.default.dirname(modulePath);
    if (filePath.startsWith(moduleDir)) return true;
    return false;
}
function fileType(filePath) {
    var pkg = (0, _packageUp.default)(filePath);
    if (!pkg) return "commonjs";
    if (isEntry(filePath, pkg, "module")) return "module";
    if (isEntry(filePath, pkg, "main")) return "commonjs";
    if (pkg.json.type) return pkg.json.type;
    if (pkg.json.module) return "module";
    if (pkg.json.main) return "commonjs";
    return "commonjs";
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }