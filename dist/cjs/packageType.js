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
var _url = require("url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var packageJSONCache = new Map();
function readPackageJson(path) {
    var existing = packageJSONCache.get(path);
    if (existing !== undefined) return existing;
    try {
        var packageJson = JSON.parse(_fs.default.readFileSync(path, "utf8"));
        packageJSONCache.set(path, packageJson);
        return packageJson;
    } catch (_err) {
        packageJSONCache.set(path, null);
        return null;
    }
}
// https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/package_config.js#L103
function getPackageScopeConfig(resolved) {
    var packageJSONUrl = new _url.URL("./package.json", resolved);
    while(packageJSONUrl){
        var packageJSONPath = packageJSONUrl.pathname;
        if (packageJSONPath.endsWith("node_modules/package.json")) {
            break;
        }
        var packageConfig = readPackageJson((0, _url.fileURLToPath)(packageJSONUrl));
        if (packageConfig) return packageConfig;
        var lastPackageJSONUrl = packageJSONUrl;
        packageJSONUrl = new _url.URL("../package.json", packageJSONUrl);
        // Terminates at root where ../package.json equals ../../package.json
        // (can't just check "/package.json" for Windows support).
        if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
    }
    return {};
}
function packageType(url) {
    if (_path.default.isAbsolute(url)) url = (0, _url.pathToFileURL)(url); // windows
    var pkg = getPackageScopeConfig(url);
    return pkg.type || "commonjs";
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}