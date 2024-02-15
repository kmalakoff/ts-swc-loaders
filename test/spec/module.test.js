const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnArgs = require('../..').spawnArgs;

const devStack = require('ts-dev-stack');

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const major = +process.versions.node.split('.')[0];
const type = major >= 12 ? 'module' : 'commonjs';
const cmd = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', major >= 12 ? '_mocha' : '_mocha-compat');

describe('module', function () {
  it('tests', function(done) {
    const args = spawnArgs(type, cmd, ['--watch-extensions', 'ts,tsx', 'test/module/**/*.*'], { cwd: DATA_DIR, stdio: 'inherit' });
    spawn(args[0], args[1], args[2], function(err) {
      assert.ok(!err);
      done();
    });
  });

  before(function(cb) {
    devStack.link([], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }, cb);
  });
  after(function(cb) {
    devStack.unlink([], { installPath: DATA_MODULE_DIR }, cb);
  });
});
