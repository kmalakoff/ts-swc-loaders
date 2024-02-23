"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return packageType;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var packageJSONCache = new Map();
function readPackageJson(packagePath) {
    var existing = packageJSONCache.get(packagePath);
    if (existing !== undefined) return existing;
    try {
        var packageJson = JSON.parse(_fs.default.readFileSync(packagePath, "utf8"));
        packageJSONCache.set(packagePath, packageJson);
        return packageJson;
    } catch (_err) {
        packageJSONCache.set(packagePath, null);
        return null;
    }
}
function getPackageScopeConfig(filePath) {
    var packageDir = filePath;
    while(packageDir){
        if (packageDir.endsWith("node_modules")) break;
        var packageConfig = readPackageJson(_path.default.join(packageDir, "package.json"));
        if (packageConfig) return packageConfig;
        var prev = packageDir;
        packageDir = _path.default.dirname(packageDir);
        if (packageDir === "" || packageDir === prev) break;
    }
    return {};
}
function packageType(filePath) {
    var pkg = getPackageScopeConfig(filePath);
    return pkg.type || "commonjs";
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }