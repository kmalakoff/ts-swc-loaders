// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const { linkModule, unlinkModule } = require('module-link-unlink');
const cr = require('cr');

const { parse } = require('ts-swc-loaders');

const major = +process.versions.node.split('.')[0];
const type = 'commonjs';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

describe('commonjs', () => {
  major > 0 ||
    it('loader', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });

  major <= 0 ||
    it('node', (done) => {
      const parsed = parse(type, process.execPath, ['./test/index.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
});
