"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getFormat: function() {
        return getFormat;
    },
    transformSource: function() {
        return transformSource;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _isbuiltinmodule = /*#__PURE__*/ _interop_require_default(require("is-builtin-module"));
var _tsswctransform = require("ts-swc-transform");
var _constants = require("../constants.js");
var _Cache = /*#__PURE__*/ _interop_require_default(require("../lib/Cache.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../lib/loadTSConfig.js"));
var _processcjs = /*#__PURE__*/ _interop_require_default(require("../lib/process.js"));
var _extToFormat = /*#__PURE__*/ _interop_require_default(require("./extToFormat.js"));
var _fileType = /*#__PURE__*/ _interop_require_default(require("./fileType.js"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_processcjs.default.cwd());
var match = (0, _tsswctransform.createMatcher)(config);
function _getFormat(url, context, next) {
    return __getFormat.apply(this, arguments);
}
function __getFormat() {
    __getFormat = _async_to_generator(function(url, context, next) {
        var filePath, ext, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if ((0, _isbuiltinmodule.default)(url)) return [
                        2,
                        next(url, context)
                    ];
                    if (!!url.startsWith('file://')) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        next(url, context)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
                case 2:
                    filePath = (0, _tsswctransform.toPath)(url, context);
                    ext = _path.default.extname(filePath);
                    if (!!match(filePath)) return [
                        3,
                        4
                    ];
                    if (!ext) return [
                        2,
                        {
                            format: 'commonjs'
                        }
                    ]; // args bin is cjs in a module
                    return [
                        4,
                        next(url, context)
                    ];
                case 3:
                    return [
                        2,
                        _state.sent()
                    ];
                case 4:
                    // file
                    data = {
                        format: (0, _extToFormat.default)(ext)
                    };
                    if (!data.format || [
                        '.js',
                        '.jsx'
                    ].indexOf(ext) >= 0) data.format = (0, _fileType.default)(filePath);
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return __getFormat.apply(this, arguments);
}
function _transformSource(source, context, next) {
    return __transformSource.apply(this, arguments);
}
function __transformSource() {
    __transformSource = _async_to_generator(function(source, context, next) {
        var loaded, filePath, ext, contents, compiled;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if ((0, _isbuiltinmodule.default)(context.url)) return [
                        2,
                        next(source, context)
                    ];
                    return [
                        4,
                        next(source, context)
                    ];
                case 1:
                    loaded = _state.sent();
                    filePath = (0, _tsswctransform.toPath)(context.url);
                    ext = _path.default.extname(filePath);
                    // filtered
                    if (!match(filePath)) return [
                        2,
                        loaded
                    ];
                    if (_constants.typeFileRegEx.test(filePath)) return [
                        2,
                        {
                            source: ''
                        }
                    ];
                    if (ext === '.json') return [
                        2,
                        loaded
                    ];
                    if (_tsswctransform.extensions.indexOf(ext) < 0) return [
                        2,
                        loaded
                    ];
                    contents = loaded.source.toString();
                    compiled = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
                        return (0, _tsswctransform.transformSync)(contents, filePath, config);
                    });
                    return [
                        2,
                        {
                            source: compiled.code
                        }
                    ];
            }
        });
    });
    return __transformSource.apply(this, arguments);
}
var major = +_processcjs.default.versions.node.split('.')[0];
var getFormat = major < 16 ? _getFormat : undefined;
var transformSource = major < 16 ? _transformSource : undefined;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }