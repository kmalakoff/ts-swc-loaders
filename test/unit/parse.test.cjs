// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');
const { parse } = require('ts-swc-loaders');
const cr = require('cr');

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);

describe('parse', () => {
  describe('happy path', () => {
    it('parses', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test.ts'], { cwd: DATA_DIR, env: process.env, encoding: 'utf8' });
      assert.equal(typeof parsed.command, 'string');
      assert.equal(typeof parsed.args[0], 'string');
      assert.equal(typeof parsed.options.cwd, 'string');
      assert.equal(typeof parsed.options.env, 'object');

      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(res.status, 0);
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });
  });
});
