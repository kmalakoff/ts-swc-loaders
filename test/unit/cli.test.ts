// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';
import rimraf2 from 'rimraf2';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const mocha = major < 12 ? 'mocha-compat' : major < 14 ? 'mocha-compat-esm' : 'mocha';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.cjs');
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

const TS_SWC_CACHE_PATH = path.join(__dirname, '..', '..', '.tmp');
const spawnOptions = { cwd: DATA_DIR, encoding: 'utf8', env: { ...process.env, TS_SWC_CACHE_PATH } } as SpawnOptions;

// @ts-ignore
import type { SpawnOptions } from 'ts-swc-loaders';

describe('cli', () => {
  if (major === 12) return; // TODO: fix mocha compat esm

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));

  it('rimraf', (done) => rimraf2(TS_SWC_CACHE_PATH, { disableGlob: true }, done));

  it('run with cli option', (done) => {
    spawn(CLI, [mocha, '--watch-extensions', 'ts,tsx', '--no-timeouts', 'test/*.test-test.ts'], spawnOptions, (err, res) => {
      if (err) return done(err.message);
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });

  it('clear', (done) => {
    assert.ok(fs.readdirSync(TS_SWC_CACHE_PATH).length > 0);
    spawn(CLI, ['--clear'], spawnOptions, (err, _res) => {
      if (err) return done(err.message);

      try {
        fs.statSync(TS_SWC_CACHE_PATH);
        assert.ok(false);
      } catch (err) {
        assert.ok(!!err);
        done();
      }
    });
  });
});
