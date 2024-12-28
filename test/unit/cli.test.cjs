// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const { linkModule, unlinkModule } = require('module-link-unlink');
const cr = require('cr');

const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.js');

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

const command = type === 'commonjs' ? 'mocha-compat' : 'mocha';

describe('cli', () => {
  it('run with cli option', (done) => {
    spawn(CLI, [command, 'test/*.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' }, (err, res) => {
      assert.ok(!err, err ? err.message : '');
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
});
