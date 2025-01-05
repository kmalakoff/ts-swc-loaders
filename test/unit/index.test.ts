// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';

// @ts-ignore
import { clean, parse } from 'ts-swc-loaders';

const major = +process.versions.node.split('.')[0];
const type = typeof __filename !== 'undefined' ? 'commonjs' : 'module';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

describe(`conventions (${type})`, () => {
  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  beforeEach(() => clean());

  describe('conventions', () => {
    if (major <= 0) {
      it('loader', (done) => {
        const parsed = parse(type, './loader.js', ['./test/index.test-test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
        spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
          if (err) return done(err);
          assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
          done();
        });
      });
    } else {
      it('node', (done) => {
        const parsed = parse(type, process.execPath, ['./test/index.test-test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
        spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
          if (err) return done(err);
          assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
          done();
        });
      });
    }
  });

  describe('happy path', () => {
    it('parses', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test-test.ts'], { cwd: DATA_DIR, env: process.env, encoding: 'utf8' });
      assert.equal(typeof parsed.command, 'string');
      assert.equal(typeof parsed.args[0], 'string');
      assert.equal(typeof parsed.options.cwd, 'string');
      assert.equal(typeof parsed.options.env, 'object');
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        if (err) return done(err);
        if (err) return done(err);
        assert.equal(res.status, 0);
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });
  });
});
