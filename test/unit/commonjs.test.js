// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnParams = require('ts-swc-loaders').spawnParams;

const devStack = require('ts-dev-stack');

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const major = +process.versions.node.split('.')[0];

describe('commonjs', function () {
  major > 0 ||
    it('loader', function (done) {
      const args = spawnParams('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
      spawn('./commonjs/loader', args.args.concat(['./index.ts', 'arg']), args.options, function (err, res) {
        var stdout = err ? err.stdout : res.stdout;
        assert.equal(stdout, 'success: arg\n');
        done();
      });
    });

  major <= 0 ||
    it('node', function (done) {
      const args = spawnParams('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
      spawn('node', args.args.concat(['./commonjs/index.ts', 'arg']), args.options, function (err, res) {
        var stdout = err ? err.stdout : res.stdout;
        assert.equal(stdout, 'success: arg\n');
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
