// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import fs from 'fs';
import { safeRm, safeRmSync } from 'fs-remove-compat';
import mkdirp from 'mkdirp-classic';
import { linkModule, unlinkModule } from 'module-link-unlink';
import path from 'path';
import type { SpawnOptions } from 'ts-swc-loaders';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const mocha = major < 12 ? 'mocha-compat' : major < 14 ? 'mocha-compat-esm' : 'mocha';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.js');
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');
const PKG_PATH = path.join(MODULE_DIR, 'package.json');

const TS_SWC_CACHE_PATH = path.join(__dirname, '..', '..', '.tmp');
const spawnOptions = {
  cwd: DATA_DIR,
  encoding: 'utf8',
  env: { ...process.env, TS_SWC_CACHE_PATH },
} as SpawnOptions;

describe('cli', () => {
  if (major === 12) return; // TODO: fix mocha compat esm

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));

  it('rimraf', (done) => safeRm(TS_SWC_CACHE_PATH, done));

  it('run with cli option', (done) => {
    spawn(CLI, [mocha, '--watch-extensions', 'ts,tsx', '--no-timeouts', 'test/*.test-test.ts'], spawnOptions, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });

  it('clear', (done) => {
    assert.ok(fs.readdirSync(TS_SWC_CACHE_PATH).length > 0);
    spawn(CLI, ['--clear'], spawnOptions, (err, _res) => {
      if (err) {
        done(err.message);
        return;
      }

      try {
        fs.statSync(TS_SWC_CACHE_PATH);
        assert.ok(false);
      } catch (err) {
        assert.ok(!!err);
        done();
      }
    });
  });

  it('--version', (done) => {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
    spawn(CLI, ['--version'], spawnOptions, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      assert.equal(cr(res.stdout).trim(), pkg.version);
      done();
    });
  });

  it('-v', (done) => {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
    spawn(CLI, ['-v'], spawnOptions, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      assert.equal(cr(res.stdout).trim(), pkg.version);
      done();
    });
  });

  it('--help', (done) => {
    spawn(CLI, ['--help'], spawnOptions, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      const output = cr(res.stdout);
      assert.ok(output.indexOf('Usage:') >= 0);
      assert.ok(output.indexOf('--clear') >= 0);
      assert.ok(output.indexOf('--help') >= 0);
      assert.ok(output.indexOf('--version') >= 0);
      done();
    });
  });

  it('-h', (done) => {
    spawn(CLI, ['-h'], spawnOptions, (err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      const output = cr(res.stdout);
      assert.ok(output.indexOf('Usage:') >= 0);
      assert.ok(output.indexOf('--clear') >= 0);
      assert.ok(output.indexOf('--help') >= 0);
      assert.ok(output.indexOf('--version') >= 0);
      done();
    });
  });

  describe('edge cases', () => {
    it('--clear exits cleanly when cache does not exist', (done) => {
      safeRmSync(TS_SWC_CACHE_PATH);
      spawn(CLI, ['--clear'], spawnOptions, (err, res) => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(res.status, 0);
        done();
      });
    });

    it('shows error message when invoked with no arguments', (done) => {
      spawn(CLI, [], spawnOptions, (err) => {
        // CLI exits with error code 17 when no command provided
        assert.ok(err);
        assert.equal(err.status, 17);
        assert.ok(err.stdout.indexOf('Missing command') >= 0);
        done();
      });
    });

    it('--clear works with silent flag implied', (done) => {
      const key = path.join(TS_SWC_CACHE_PATH, 'test-file.json');
      mkdirp.sync(path.dirname(key));
      fs.writeFileSync(key, '{}', 'utf8');
      spawn(CLI, ['--clear'], spawnOptions, (err, res) => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(res.status, 0);
        done();
      });
    });
  });
});
