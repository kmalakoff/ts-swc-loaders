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
    load: function() {
        return load;
    },
    resolve: function() {
        return resolve;
    }
});
var _fs = require("fs");
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _url = require("url");
var _isbuiltinmodule = /*#__PURE__*/ _interop_require_default(require("is-builtin-module"));
var _process = /*#__PURE__*/ _interop_require_default(require("process"));
var _tsswctransform = require("ts-swc-transform");
var _constants = require("../constants.js");
var _extensions = /*#__PURE__*/ _interop_require_default(require("../extensions.js"));
var _Cache = /*#__PURE__*/ _interop_require_default(require("../lib/Cache.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../lib/loadTSConfig.js"));
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
var major = +_process.default.versions.node.split('.')[0];
var importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_process.default.cwd());
var match = (0, _tsswctransform.createMatcher)(config);
function resolve(specifier, context, next) {
    return _resolve.apply(this, arguments);
}
function _resolve() {
    _resolve = _async_to_generator(function(specifier, context, next) {
        var filePath, ext, data, data1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if ((0, _isbuiltinmodule.default)(specifier)) return [
                        2,
                        next(specifier, context)
                    ];
                    filePath = (0, _tsswctransform.toPath)(specifier, context);
                    ext = _path.default.extname(filePath);
                    if (!!match(filePath)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        next(specifier, context)
                    ];
                case 1:
                    data = _state.sent();
                    if (!data.format) data.format = 'commonjs';
                    if (_path.default.isAbsolute(filePath) && !ext) data.format = 'commonjs'; // args bin is cjs in a module
                    return [
                        2,
                        data
                    ];
                case 2:
                    // use default resolve and infer from package type
                    filePath = (0, _tsswctransform.resolveFileSync)(specifier, context);
                    data1 = {
                        url: (0, _url.pathToFileURL)(filePath).href,
                        format: (0, _extToFormat.default)(ext),
                        shortCircuit: true
                    };
                    if (!data1.format) data1.format = (0, _fileType.default)(filePath);
                    return [
                        2,
                        data1
                    ];
            }
        });
    });
    return _resolve.apply(this, arguments);
}
function load(url, context, next) {
    return _load.apply(this, arguments);
}
function _load() {
    _load = _async_to_generator(function(url, context, next) {
        var data, filePath, ext, contents, compiled;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if ((0, _isbuiltinmodule.default)(url)) return [
                        2,
                        next(url, context)
                    ];
                    if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, {
                        type: 'json'
                    });
                    return [
                        4,
                        next(url, context)
                    ];
                case 1:
                    data = _state.sent();
                    filePath = (0, _tsswctransform.toPath)(data.responseURL || url, context);
                    ext = _path.default.extname(filePath);
                    if (!(!data.source && data.type === 'module')) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        _fs.promises.readFile(filePath)
                    ];
                case 2:
                    data.source = _state.sent();
                    _state.label = 3;
                case 3:
                    // filtered
                    if (!match(filePath)) return [
                        2,
                        data
                    ];
                    if (_constants.typeFileRegEx.test(filePath)) return [
                        2,
                        _object_spread_props(_object_spread({}, data), {
                            format: 'module',
                            source: ''
                        })
                    ];
                    if (_extensions.default.indexOf(ext) < 0) return [
                        2,
                        data
                    ];
                    if (!!data.source) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        _fs.promises.readFile(filePath)
                    ];
                case 4:
                    data.source = _state.sent();
                    _state.label = 5;
                case 5:
                    contents = data.source.toString();
                    compiled = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
                        return (0, _tsswctransform.transformSync)(contents, filePath, config);
                    });
                    return [
                        2,
                        _object_spread_props(_object_spread({}, data), {
                            source: compiled.code,
                            shortCircuit: true
                        })
                    ];
            }
        });
    });
    return _load.apply(this, arguments);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }