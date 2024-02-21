// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const _spawn = require('cross-spawn-cb');
const devStack = require('ts-dev-stack');
const cr = require('cr');

const _CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.js');
const cli = require('../../dist/cjs/cli.js');

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const cmd = major < 12 ? 'mocha-compat' : 'mocha';

describe('cli', () => {
  it('run with cli option', (done) => {
    cli([cmd, 'test/*.test.ts'], { encoding: 'utf8', cwd: DATA_DIR }, (err, res) => {
      // spawn(CLI, [cmd, 'test/*.test.ts'], { encoding: 'utf8', cwd: DATA_DIR }, (err, res) => {
      console.log(err, res);
      assert.ok(
        cr(err ? err.stdout : res.stdout)
          .split('\n')
          .slice(-2)[0]
          .indexOf('ran successfully') === 0
      );
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
