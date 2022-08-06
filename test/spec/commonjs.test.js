var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var spawnArgs = require('../../lib/spawnArgs');

var DATA_DIR = path.resolve(__dirname, '..', 'data');

describe('commonjs', function () {
  it('tests', function (done) {
    var args = spawnArgs('commonjs', 'mocha-compat', ['--watch-extensions', 'ts,tsx', 'test/commonjs/**/*.*'], { cwd: DATA_DIR, stdio: 'inherit' });

    spawn(args[0], args[1], args[2], function (err) {
      assert.ok(!err);
      done();
    });
  });
});
