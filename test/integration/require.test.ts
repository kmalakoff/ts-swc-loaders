// The entry sits outside the tsconfig include so Node loads it with the legacy CJS loader, the
// shape mocha's own bin has; inside the include it takes Node's ESM-embedded CJS translator.

// remove NODE_OPTIONS to not interfere with tests
delete process.env.NODE_OPTIONS;

import assert from 'assert';
// @ts-expect-error: no types for cr
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { safeRm } from 'fs-remove-compat';
import { linkModule, unlinkModule } from 'module-link-unlink';
import path from 'path';
import type { SpawnOptions } from 'ts-swc-loaders';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.js');
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', 'module');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

const TS_SWC_CACHE_PATH = path.join(__dirname, '..', '..', '.tmp');
const spawnOptions = {
  cwd: DATA_DIR,
  encoding: 'utf8',
  env: { ...process.env, TS_SWC_CACHE_PATH },
} as SpawnOptions;

describe('require() of a .ts file', () => {
  // Below Node's require_module there is no require(esm) at all, so the loader only serves
  // import() and there is no require() path here to cover.
  if (!process.features.require_module) return;

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));

  it('rimraf', (done) => safeRm(TS_SWC_CACHE_PATH, done));

  it('transpiles require("./generic-fn.ts") through bin/require-ts.cjs', (done) => {
    // Node strips types natively from 22.18 (process.features.typescript === 'strip'), which
    // would mask the loader on this path; disable it so the assertion proves the loader, not Node.
    const args = ['node', ...(process.features.typescript !== undefined ? ['--no-experimental-strip-types'] : []), 'bin/require-ts.cjs'];
    spawn(CLI, args, spawnOptions, (err, res) => {
      if (err) return done(err as Error);
      if (!res) return done(new Error('no res'));
      assert.ok(cr(res.stdout).indexOf('REQUIRE_TS_OK') >= 0, `expected REQUIRE_TS_OK, got: ${res.stdout}`);
      done();
    });
  });
});
