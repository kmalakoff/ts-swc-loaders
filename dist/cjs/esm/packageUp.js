"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return packageUp;
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
function getPackage(packagePath) {
    var existing = packageJSONCache.get(packagePath);
    if (existing !== undefined) return existing;
    try {
        var packageJson = JSON.parse(_fs.default.readFileSync(packagePath, 'utf8'));
        packageJSONCache.set(packagePath, packageJson);
        return packageJson;
    } catch (_err) {
        packageJSONCache.set(packagePath, null);
        return null;
    }
}
function packageUp(filePath) {
    var dir = filePath;
    while(dir){
        if (dir.endsWith('node_modules')) break;
        var json = getPackage(_path.default.join(dir, 'package.json'));
        if (json) return {
            json: json,
            dir: dir
        };
        dir = _path.default.dirname(dir);
    }
    return null;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }