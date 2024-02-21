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

describe.skip('commonjs', () => {
  major > 12 ||
    it('loader', (done) => {
      spawn('./loader', args.args.concat(['./test/index.test.ts']), args.options, (err, res) => {
        // console.log(err, res)
        assert.ok(
          cr(err ? err.stdout : res.stdout)
            .split('\n')
            .slice(-2)[0]
            .indexOf('ran successfully') === 0
        );
        done();
      });
    });

  major <= 12 ||
    it('node', (done) => {
      spawn(process.execPath, args.args.concat(['./test/index.test.ts']), args.options, (err, res) => {
        console.log(err, res);
        cr(err ? err.stdout : res.stdout)
          .split('\n')
          .slice(-2)[0]
          .indexOf('ran successfully') === 0;
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
