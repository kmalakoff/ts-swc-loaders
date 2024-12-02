"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Cache;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _os = /*#__PURE__*/ _interop_require_default(require("os"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _osshim = /*#__PURE__*/ _interop_require_default(require("os-shim"));
var _mkdirp = /*#__PURE__*/ _interop_require_default(require("mkdirp"));
var _shorthash = /*#__PURE__*/ _interop_require_default(require("short-hash"));
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var tmpdir = _os.default.tmpdir || _osshim.default.tmpdir;
function unlinkSafe(filePath) {
    try {
        _fs.default.unlinkSync(filePath);
    } catch (_err) {
    // skip
    }
}
function timeMS() {
    return new Date().valueOf();
}
var MS_TO_DAYS = 1000 * 60 * 60 * 24;
var Cache = /*#__PURE__*/ function() {
    "use strict";
    function Cache(options) {
        _class_call_check(this, Cache);
        options = options || {};
        this.cwd = process.cwd();
        this.cwdHash = (0, _shorthash.default)(process.cwd());
        this.root = options.root || _path.default.join(tmpdir(), 'ts-swc-loaders');
        this.maxAge = options.maxAge || 1 * MS_TO_DAYS;
    }
    var _proto = Cache.prototype;
    _proto.cachePath = function cachePath(filePath, options) {
        var relFilePath = _path.default.relative(this.cwd, filePath);
        var basename = _path.default.basename(relFilePath);
        var dirHash = (0, _shorthash.default)(_path.default.dirname(relFilePath));
        if (options) basename += "-".concat((0, _shorthash.default)(JSON.stringify(options || {})));
        return _path.default.join(this.root, this.cwdHash, dirHash, "".concat(basename, ".json"));
    };
    _proto.get = function get(cachePath) {
        var record = this.getRecord(cachePath);
        return record ? record.data : null;
    };
    _proto.getRecord = function getRecord(cachePath) {
        try {
            var record = JSON.parse(_fs.default.readFileSync(cachePath, 'utf8'));
            var time = timeMS();
            if (time - record.time > this.maxAge) {
                unlinkSafe(cachePath);
                return null;
            }
            return record;
        } catch (_err) {
            return null;
        }
    };
    _proto.getOrUpdate = function getOrUpdate(cachePath, contents, fn) {
        var hash = (0, _shorthash.default)(contents);
        var record = this.getRecord(cachePath);
        if (record && record.hash === hash) return record.data;
        // miss
        var data = fn(contents);
        this.set(cachePath, data, {
            hash: hash
        });
        return data;
    };
    _proto.set = function set(cachePath, data, options) {
        options = options || {};
        var record = {
            data: data,
            time: options.time || timeMS(),
            hash: options.hash
        };
        _mkdirp.default.sync(_path.default.dirname(cachePath));
        _fs.default.writeFileSync(cachePath, JSON.stringify(record), 'utf8');
    };
    return Cache;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }