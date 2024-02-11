var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var spawnArgs = require('../../lib/spawnArgs');
var devStack = require('ts-dev-stack');

var MODULE_DIR = path.resolve(__dirname, '..', '..');
var DATA_DIR = path.resolve(__dirname, '..', 'data');
var DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

var major = +process.versions.node.split('.')[0];
var type = major >= 12 ? 'module' : 'commonjs';
var cmd = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', major >= 12 ? '_mocha' : '_mocha-compat');

describe('module', function () {
  it('tests', function (done) {
    var args = spawnArgs(type, cmd, ['--watch-extensions', 'ts,tsx', 'test/module/**/*.*'], { cwd: DATA_DIR, stdio: 'inherit' });
    spawn(args[0], args[1], args[2], function (err) {
      assert.ok(!err);
      done();
    });
  });

  before(function (cb) {
    devStack.link([], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }, cb);
  });
  after(function (cb) {
    devStack.unlink([], { installPath: DATA_MODULE_DIR }, cb);
  });
});
