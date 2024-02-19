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
var _url = require("url");
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
var INTERNAL_PATHS = [
    new _url.URL("..", require("url").pathToFileURL(__filename).toString()).href,
    new _url.URL("../../node_modules", require("url").pathToFileURL(__filename).toString()).href
];
var isInternal = function(x) {
    return INTERNAL_PATHS.some(function(y) {
        return x.startsWith(y);
    });
};
var EXT_TO_FORMAT = {
    ".json": "json",
    ".mjs": "module",
    ".mts": "module",
    ".cjs": "commonjs",
    ".cts": "commonjs"
};
var cache = new _Cache.default();
var config = (0, _loadTSConfig.default)(_path.default.resolve(process.cwd(), "tsconfig.json"));
var match = (0, _createMatcher.default)(config);
function _getFormat(url, context, defaultGetFormat) {
    return __getFormat.apply(this, arguments);
}
function __getFormat() {
    __getFormat = _async_to_generator(function(url, context, defaultGetFormat) {
        var parentURL, ext, format;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    parentURL = context.parentURL && _path.default.isAbsolute(context.parentURL) ? (0, _url.pathToFileURL)(context.parentURL) : context.parentURL; // windows
                    url = parentURL ? new _url.URL(specifier, parentURL).href : url;
                    // internals
                    if (isInternal(url)) return [
                        2,
                        {
                            format: (0, _packageType.default)(url)
                        }
                    ];
                    // file
                    if (url.startsWith("file://")) {
                        ext = _path.default.extname(url);
                        format = EXT_TO_FORMAT[ext];
                        if (!format) format = ext.length ? (0, _packageType.default)(url) : "commonjs"; // no extension assume commonjs
                        return [
                            2,
                            {
                                format: format
                            }
                        ];
                    }
                    return [
                        4,
                        defaultGetFormat(url, context, defaultGetFormat)
                    ];
                case 1:
                    // relative
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return __getFormat.apply(this, arguments);
}
function _transformSource(source, context, defaultTransformSource) {
    return __transformSource.apply(this, arguments);
}
function __transformSource() {
    __transformSource = _async_to_generator(function(source, context, defaultTransformSource) {
        var url, parentURL, loaded, filePath, contents, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = context.url;
                    parentURL = context.parentURL && _path.default.isAbsolute(context.parentURL) ? (0, _url.pathToFileURL)(context.parentURL) : context.parentURL; // windows
                    url = parentURL ? new _url.URL(specifier, parentURL).href : url;
                    return [
                        4,
                        defaultTransformSource(source, context, defaultTransformSource)
                    ];
                case 1:
                    loaded = _state.sent();
                    filePath = (0, _url.fileURLToPath)(url);
                    // filter
                    if (isInternal(url)) return [
                        2,
                        loaded
                    ];
                    if (url.endsWith(".d.ts")) return [
                        2,
                        {
                            source: ""
                        }
                    ];
                    if (_extensions.default.indexOf(_path.default.extname(filePath)) < 0) return [
                        2,
                        loaded
                    ];
                    if (!match(filePath)) return [
                        2,
                        loaded
                    ];
                    contents = loaded.source.toString();
                    data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function() {
                        return (0, _transformSync.default)(contents, filePath, config);
                    });
                    return [
                        2,
                        {
                            source: data.code
                        }
                    ];
            }
        });
    });
    return __transformSource.apply(this, arguments);
}
var major = +process.versions.node.split(".")[0];
var getFormat = major < 16 ? _getFormat : undefined;
var transformSource = major < 16 ? _transformSource : undefined;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }