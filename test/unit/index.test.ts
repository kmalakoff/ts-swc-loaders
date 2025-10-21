// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'node:assert';
import path from 'node:path';
import url from 'node:url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';
import rimraf2 from 'rimraf2';

const major = +process.versions.node.split('.')[0];
const type = typeof __filename !== 'undefined' ? 'commonjs' : 'module';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

const TS_SWC_CACHE_PATH = path.join(__dirname, '..', '..', '.tmp');
const spawnOptions = {
  cwd: DATA_DIR,
  encoding: 'utf8',
  env: { ...process.env, TS_SWC_CACHE_PATH },
} as SpawnOptions;

import { parse, type SpawnOptions } from 'ts-swc-loaders';

describe(`conventions (${type})`, () => {
  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  beforeEach(() => rimraf2.sync(TS_SWC_CACHE_PATH, { disableGlob: true }));
  afterEach(() => rimraf2.sync(TS_SWC_CACHE_PATH, { disableGlob: true }));

  describe('conventions', () => {
    if (major <= 0) {
      it('loader', (done) => {
        const parsed = parse(type, './loader.js', ['./test/index.test-test.ts'], spawnOptions);
        spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
          if (err) {
            done(err.message);
            return;
          }
          assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
          done();
        });
      });
    } else {
      it('node', (done) => {
        const parsed = parse(type, process.execPath, ['./test/index.test-test.ts'], spawnOptions);
        spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
          if (err) {
            done(err.message);
            return;
          }
          assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
          done();
        });
      });
    }
  });

  describe('happy path', () => {
    it('parses', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test-test.ts'], spawnOptions);
      assert.equal(typeof parsed.command, 'string');
      assert.equal(typeof parsed.args[0], 'string');
      assert.equal(typeof parsed.options.cwd, 'string');
      assert.equal(typeof parsed.options.env, 'object');
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        if (err) {
          done(err.message);
          return;
        }
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(res.status, 0);
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });
  });
});
