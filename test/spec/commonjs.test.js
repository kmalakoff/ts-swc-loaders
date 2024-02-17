// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnArgs = require('ts-swc-loaders').spawnArgs;

const devStack = require('ts-dev-stack');

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

describe('commonjs', function () {
  it('tests', function (done) {
    const args = spawnArgs('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
    spawn('./loader.js', args.args.concat(['commonjs/index.ts', 'arg']), args.options, function (err, res) {
      assert.ok(!err);
      assert.equal(res.stdout, 'success: arg\n');
      done();
    });
  });

  before(function (cb) {
    devStack.link([], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }, cb);
  });
  after(function(cb) {
    devStack.unlink([], { installPath: DATA_MODULE_DIR }, cb);
  });
});
