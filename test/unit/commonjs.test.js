// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnParams = require('ts-swc-loaders').spawnParams;
const cr = require('cr');

const devStack = require('ts-dev-stack');

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const major = +process.versions.node.split('.')[0];

describe('commonjs', () => {
  major > 0 ||
    it('loader', (done) => {
      const args = spawnParams('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
      spawn('./commonjs/loader', args.args.concat(['./index.ts', 'arg']), args.options, (err, res) => {
        assert.equal(
          cr(err ? err.stdout : res.stdout)
            .split('\n')
            .slice(-2)[0],
          'success: arg'
        );
        done();
      });
    });

  major <= 0 ||
    it('node', (done) => {
      const args = spawnParams('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
      spawn('node', args.args.concat(['./commonjs/index.ts', 'arg']), args.options, (err, res) => {
        const stdout = err ? err.stdout : res.stdout;
        assert.equal(stdout, 'success: arg\n');
        done();
      });
    });

  before((cb) => {
    devStack.link([], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }, cb);
  });
  after((cb) => {
    devStack.unlink([], { installPath: DATA_MODULE_DIR }, cb);
  });
});
