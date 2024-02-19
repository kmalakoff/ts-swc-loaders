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
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _url = require("url");
var _process = /*#__PURE__*/ _interop_require_default(require("process"));
var _Cache = /*#__PURE__*/ _interop_require_default(require("../Cache.js"));
var _createMatcher = /*#__PURE__*/ _interop_require_default(require("../createMatcher.js"));
var _extensions = /*#__PURE__*/ _interop_require_default(require("../extensions.js"));
var _loadTSConfig = /*#__PURE__*/ _interop_require_default(require("../loadTSConfig.js"));
var _packageType = /*#__PURE__*/ _interop_require_default(require("../packageType.js"));
var _transformSync = /*#__PURE__*/ _interop_require_default(require("./transformSync.js"));
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
var major = +_process.default.versions.node.split(".")[0];
var importJSONKey = major >= 18 ? "importAttributes" : "importAssertions";
var INTERNAL_PATHS = [
    new _url.URL("..", require("url").pathToFileURL(__filename).toString()).href,
    new _url.URL("../../node_modules", require("url").pathToFileURL(__filename).toString()).href
];
var isInternal = function(x) {
    return INTERNAL_PATHS.some(function(y) {
        return x.startsWith(y);
    });
};
var moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
var indexExtensions = _extensions.default.map(function(x) {
    return "index".concat(x);
});
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_path.default.resolve(_process.default.cwd(), "tsconfig.json"));
var match = (0, _createMatcher.default)(config);
function resolve(specifier1, context, defaultResolve) {
    return _resolve.apply(this, arguments);
}
function _resolve() {
    _resolve = _async_to_generator(function(specifier1, context, defaultResolve) {
        var parentURL, url, ext, data, items, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, err, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, ext1, _err, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (specifier1.startsWith("node:")) specifier1 = specifier1.slice(5); // node built-in
                    parentURL = context.parentURL && _path.default.isAbsolute(context.parentURL) ? (0, _url.pathToFileURL)(context.parentURL) : context.parentURL; // windows
                    url = parentURL ? new _url.URL(specifier1, parentURL).href : new _url.URL(specifier1).href;
                    // resolve from extension or as a module
                    ext = _path.default.extname(specifier1);
                    if (!(ext.length || moduleRegEx.test(specifier1))) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        defaultResolve(specifier1, context, defaultResolve)
                    ];
                case 1:
                    data = _state.sent();
                    if (!data.format) data.format = ext.length ? (0, _packageType.default)(url) : "commonjs"; // no extension assume commonjs
                    return [
                        2,
                        data
                    ];
                case 2:
                    if (!specifier1.endsWith("/")) return [
                        3,
                        11
                    ];
                    items = _fs.default.readdirSync(specifier1);
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        8,
                        9,
                        10
                    ]);
                    _iterator = items[Symbol.iterator]();
                    _state.label = 4;
                case 4:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        7
                    ];
                    item = _step.value;
                    if (!(indexExtensions.indexOf(item) >= 0)) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        resolve(specifier1 + item, context, defaultResolve)
                    ];
                case 5:
                    return [
                        2,
                        _state.sent()
                    ];
                case 6:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        4
                    ];
                case 7:
                    return [
                        3,
                        10
                    ];
                case 8:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        10
                    ];
                case 9:
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
                case 10:
                    return [
                        3,
                        21
                    ];
                case 11:
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    _state.label = 12;
                case 12:
                    _state.trys.push([
                        12,
                        19,
                        20,
                        21
                    ]);
                    _iterator1 = _extensions.default[Symbol.iterator]();
                    _state.label = 13;
                case 13:
                    if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                        3,
                        18
                    ];
                    ext1 = _step1.value;
                    _state.label = 14;
                case 14:
                    _state.trys.push([
                        14,
                        16,
                        ,
                        17
                    ]);
                    return [
                        4,
                        resolve(specifier1 + ext1, context, defaultResolve)
                    ];
                case 15:
                    return [
                        2,
                        _state.sent()
                    ];
                case 16:
                    _err = _state.sent();
                    return [
                        3,
                        17
                    ];
                case 17:
                    _iteratorNormalCompletion1 = true;
                    return [
                        3,
                        13
                    ];
                case 18:
                    return [
                        3,
                        21
                    ];
                case 19:
                    err = _state.sent();
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                    return [
                        3,
                        21
                    ];
                case 20:
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                    return [
                        7
                    ];
                case 21:
                    throw new Error("Cannot resolve: ".concat(specifier1));
            }
        });
    });
    return _resolve.apply(this, arguments);
}
function load(url, context, defaultLoad) {
    return _load.apply(this, arguments);
}
function _load() {
    _load = _async_to_generator(function(url, context, defaultLoad) {
        var parentURL, loaded, filePath, hasSource, contents, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!url.startsWith("node:")) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        defaultLoad(url, context, defaultLoad)
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
                    parentURL = context.parentURL && _path.default.isAbsolute(context.parentURL) ? (0, _url.pathToFileURL)(context.parentURL) : context.parentURL; // windows
                    url = parentURL ? new _url.URL(specifier, parentURL).href : url;
                    return [
                        4,
                        defaultLoad(url, context, defaultLoad)
                    ];
                case 3:
                    loaded = _state.sent();
                    filePath = (0, _url.fileURLToPath)(url);
                    hasSource = loaded.source;
                    if (!hasSource) loaded.source = _fs.default.readFileSync(filePath);
                    // filter
                    if (isInternal(url)) return [
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
                    if (_extensions.default.indexOf(_path.default.extname(filePath)) < 0) return [
                        2,
                        loaded
                    ];
                    if (!match(filePath)) return [
                        2,
                        loaded
                    ];
                    // transform
                    contents = loaded.source.toString();
                    data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
                        return (0, _transformSync.default)(contents, filePath, config);
                    });
                    return [
                        2,
                        _object_spread_props(_object_spread({}, loaded), {
                            format: hasSource ? "module" : "commonjs",
                            source: data.code
                        })
                    ];
            }
        });
    });
    return _load.apply(this, arguments);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }