const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnArgs = require('../..').spawnArgs;

const DATA_DIR = path.resolve(__dirname, '..', 'data');

describe('commonjs', function () {
  it('tests', function (done) {
    const args = spawnArgs('commonjs', 'mocha-compat', ['--watch-extensions', 'ts,tsx', 'test/commonjs/**/*.*'], { cwd: DATA_DIR, stdio: 'inherit' });

    spawn(args[0], args[1], args[2], function (err) {
      assert.ok(!err);
      done();
    });
  });
});
