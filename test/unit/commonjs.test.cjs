// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const spawnParams = require('ts-swc-loaders').spawnParams;
const devStack = require('ts-dev-stack');
const cr = require('cr');

const major = +process.versions.node.split('.')[0];
const type = 'commonjs';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const args = spawnParams(type, { cwd: DATA_DIR, encoding: 'utf8' });

describe('commonjs', () => {
  major > 0 ||
    it('loader', (done) => {
      spawn('./loader', args.args.concat(['./test/index.test.ts', 'arg']), args.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });

  major <= 0 ||
    it('node', (done) => {
      spawn(process.execPath, args.args.concat(['./test/index.test.ts', 'arg']), args.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });

  before(devStack.link.bind(null, [], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }));
  after(devStack.unlink.bind(null, [], { installPath: DATA_MODULE_DIR }));
});
