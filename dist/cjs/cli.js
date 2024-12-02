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
var exit = require('exit');
var path = require('path');
var spawn = require('cross-spawn-cb');
var pathKey = require('env-path-key');
var prepend = require('path-string-prepend');
var spawnParams = require('./index.js').spawnParams;
var which = require('which');
var major = +process.versions.node.split('.')[0];
var type = major < 12 ? 'commonjs' : 'module';
module.exports = function cli(args, options, cb) {
    options = options || {};
    var cwd = options.cwd || process.cwd();
    var env = _object_spread({}, process.env);
    var PATH_KEY = pathKey();
    env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', 'node_modules', '.bin'));
    env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(process.cwd(), 'node_modules', '.bin'));
    var params = spawnParams(type, _object_spread({
        stdio: 'inherit',
        cwd: cwd,
        env: env
    }, options));
    // biome-ignore lint/performance/noDelete: <explanation>
    if (options.encoding) delete params.options.stdio;
    function callback(err, res) {
        if (cb) return cb(err, res);
        if (err && err.message.indexOf('ExperimentalWarning') < 0) {
            console.log(err.message);
            return exit(err.code || -1);
        }
        exit(0);
    }
    // look up the full path
    which(args[0], {
        path: env[PATH_KEY]
    }, function(_err, cmd) {
        // not found, use the original
        if (!cmd) cmd = args[0];
        // spawn on windows
        var cmdExt = path.extname(cmd);
        if (path.extname(args[0]) !== cmdExt) return spawn(cmd, params.args.concat(args.slice(1)), params.options, callback);
        // relative, use the original
        if (args[0][0] === '.') cmd = args[0];
        // node <= 0.12 didn't take the --require option
        if (major < 12) return spawn(cmd, params.args.concat(args.slice(1)), params.options, callback);
        // send to node
        spawn(process.execPath, params.args.concat([
            cmd
        ]).concat(args.slice(1)), params.options, callback);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }