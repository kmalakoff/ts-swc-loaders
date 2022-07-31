var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var spawnArgs = require('../../lib/spawnArgs');

var DATA_DIR = path.resolve(__dirname, '..', 'data');

var major = +process.versions.node.split('.')[0];
var type = major >= 12 ? 'module' : 'commonjs';
var cmd = major >= 12 ? 'mocha' : 'mocha-compat';

describe('module', function () {
  it('tests', function (done) {
    var args = spawnArgs(type, cmd, ['--watch-extensions', 'ts,tsx', 'test/module/**/*.*'], { cwd: DATA_DIR, stdio: 'inherit' });

    spawn(args[0], args[1], args[2], function (err) {
      console.log('err', err);
      assert.ok(!err);
      done();
    });
  });
});
