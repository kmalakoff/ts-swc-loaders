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
var _nodefs = require("node:fs");
var _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
var _nodeprocess = /*#__PURE__*/ _interop_require_default(require("node:process"));
var _Cache = /*#__PURE__*/ _interop_require_default(require("../Cache.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("../createMatcher.js"));
var _extensions = /*#__PURE__*/ _interop_require_default(require("../extensions.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../loadTSConfig.js"));
var _transformSynccjs = /*#__PURE__*/ _interop_require_default(require("../transformSync.js"));
var _packageType = /*#__PURE__*/ _interop_require_default(require("./packageType.js"));
var _toPath = /*#__PURE__*/ _interop_require_default(require("./toPath.js"));
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
var major = +_nodeprocess.default.versions.node.split(".")[0];
var importJSONKey = major >= 18 ? "importAttributes" : "importAssertions";
var moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
var indexExtensions = _extensions.default.map(function(x) {
    return "index".concat(x);
});
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_nodepath.default.resolve(_nodeprocess.default.cwd(), "tsconfig.json"));
var match = (0, _createMatcher.default)(config);
function resolve(specifier, context, next) {
    return _resolve.apply(this, arguments);
}
function _resolve() {
    _resolve = _async_to_generator(function(specifier, context, next) {
        var filePath, data, items, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, err, fileName, items1, found, data1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (specifier.startsWith("node:")) return [
                        2,
                        next(specifier, context)
                    ]; // TODO: optimize, but isBuiltin not available on older node
                    filePath = (0, _toPath.default)(specifier, context);
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
                    if (!data.format) data.format = "commonjs";
                    if (_nodepath.default.isAbsolute(filePath) && !_nodepath.default.extname(filePath)) data.format = "commonjs"; // args bin is cjs in a module
                    return [
                        2,
                        data
                    ];
                case 2:
                    if (!specifier.endsWith("/")) return [
                        3,
                        12
                    ];
                    return [
                        4,
                        _nodefs.promises.readdir(filePath)
                    ];
                case 3:
                    items = _state.sent();
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        9,
                        10,
                        11
                    ]);
                    _iterator = items[Symbol.iterator]();
                    _state.label = 5;
                case 5:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        8
                    ];
                    item = _step.value;
                    if (!(indexExtensions.indexOf(item) >= 0)) return [
                        3,
                        7
                    ];
                    return [
                        4,
                        resolve(specifier + item, context, next)
                    ];
                case 6:
                    return [
                        2,
                        _state.sent()
                    ];
                case 7:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        5
                    ];
                case 8:
                    return [
                        3,
                        11
                    ];
                case 9:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        11
                    ];
                case 10:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 11:
                    return [
                        3,
                        15
                    ];
                case 12:
                    if (!(!_nodepath.default.extname(specifier) && !moduleRegEx.test(specifier))) return [
                        3,
                        15
                    ];
                    fileName = _nodepath.default.basename(filePath);
                    return [
                        4,
                        _nodefs.promises.readdir(_nodepath.default.dirname(filePath))
                    ];
                case 13:
                    items1 = _state.sent();
                    found = items1.find(function(x) {
                        return x.startsWith(fileName) && _extensions.default.indexOf(_nodepath.default.extname(x)) >= 0;
                    });
                    if (!found) return [
                        3,
                        15
                    ];
                    return [
                        4,
                        resolve(specifier + _nodepath.default.extname(found), context, next)
                    ];
                case 14:
                    return [
                        2,
                        _state.sent()
                    ];
                case 15:
                    return [
                        4,
                        next(specifier, context)
                    ];
                case 16:
                    data1 = _state.sent();
                    if (!data1.format) data1.format = (0, _packageType.default)(filePath);
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
        var loaded, filePath, hasSource, contents, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!url.startsWith("node:")) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        next(url, context, next)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
                case 2:
                    if (url.endsWith(".json")) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, {
                        type: "json"
                    });
                    return [
                        4,
                        next(url, context)
                    ];
                case 3:
                    loaded = _state.sent();
                    filePath = (0, _toPath.default)(url, context);
                    hasSource = loaded.source;
                    if (!!hasSource) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        _nodefs.promises.readFile(filePath)
                    ];
                case 4:
                    loaded.source = _state.sent();
                    _state.label = 5;
                case 5:
                    // filtered
                    if (!match(filePath)) return [
                        2,
                        loaded
                    ];
                    if (url.endsWith(".d.ts")) return [
                        2,
                        _object_spread_props(_object_spread({}, loaded), {
                            format: "module",
                            source: ""
                        })
                    ];
                    if (_extensions.default.indexOf(_nodepath.default.extname(filePath)) < 0) return [
                        2,
                        loaded
                    ];
                    // transform
                    contents = loaded.source.toString();
                    data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
                        return (0, _transformSynccjs.default)(contents, filePath, config);
                    });
                    return [
                        2,
                        _object_spread_props(_object_spread({}, loaded), {
                            format: hasSource ? "module" : "commonjs",
                            source: data.code,
                            shortCircuit: true
                        })
                    ];
            }
        });
    });
    return _load.apply(this, arguments);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }