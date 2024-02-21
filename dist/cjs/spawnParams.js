"use strict";
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
require("./polyfills.js");
var processCompat = typeof process === "undefined" ? require("process") : process;
var major = +processCompat.versions.node.split(".")[0];
// const _importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';
module.exports = function spawnParams(type, options) {
    if (type === "commonjs") return {
        args: [
            "--require",
            "ts-swc-loaders"
        ],
        options: options
    };
    // https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options
    // v20.8.0
    // if (major >= 20) return { args: ['--no-warnings=ExperimentalWarning', '--import', importArgs], options };
    // args
    var args = major > 4 ? [
        "--no-warnings=ExperimentalWarning"
    ] : [];
    // if (major <= 16) args.push('--experimental-modules');
    // options
    var env = options.env || processCompat.env;
    options = _object_spread({}, options || {});
    options.env = _object_spread({}, env);
    options.env.NODE_OPTIONS = "--loader ts-swc-loaders".concat(env.NODE_OPTIONS ? " ".concat(options.env.NODE_OPTIONS) : "");
    return {
        args: args,
        options: options
    };
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }