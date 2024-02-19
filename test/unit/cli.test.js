// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.js');
// const cli = require('../../dist/cjs/cli.js')

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

describe('cli', function () { 
  describe('happy path', function () { 
    // TODO: fix cli for NODE_OPTIONS
      it('run with cli option', function (done)  {
        // cli(['./' + type + '/loader', './index.ts', 'arg'], { encoding: 'utf8', cwd: DATA_DIR }, function (err, res) {
        spawn(CLI, ['./' + type + '/loader', './index.ts', 'arg'], { encoding: 'utf8', cwd: DATA_DIR }, function (err, res) {
          var stdout = err ? err.stdout : res.stdout;
          assert.equal(stdout, 'success: arg\n');
          done();
        });
      });
  });

  describe('unhappy path', function () {
    it('missing command', function (done)  {
      spawn(CLI, { stdout: 'inherit' },function  (err) {
        assert.ok(!!err);
        done();
      });
    });
  });
});
