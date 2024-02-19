"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return createSpawnArgs;
    }
});
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
var importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';
function createSpawnArgs(type, options, major) {
    if (type === "module") {
        if (major >= 18) {
            return {
                args: [
                    "--no-warnings=ExperimentalWarning",
                    "--import",
                    importArgs
                ],
                options: options
            };
        }
        var NODE_OPTIONS = "--loader ts-swc-loaders".concat(major < 11 ? " --experimental-modules" : "");
        var spawnOptions = _object_spread({}, options || {});
        spawnOptions.env = _object_spread({}, spawnOptions.env || {});
        spawnOptions.env.NODE_OPTIONS = "".concat(NODE_OPTIONS).concat(spawnOptions.env.NODE_OPTIONS ? " ".concat(spawnOptions.env.NODE_OPTIONS) : "");
        return {
            args: major >= 10 ? [
                "--no-warnings=ExperimentalWarning"
            ] : [],
            options: spawnOptions
        };
    }
    // commonjs
    return {
        args: [
            "--require",
            "ts-swc-loaders"
        ],
        options: options
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }