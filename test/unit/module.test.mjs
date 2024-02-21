import process from 'process';

// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import devStack from 'ts-dev-stack';
import { spawnParams } from 'ts-swc-loaders';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const type = 'module';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const args = spawnParams(type, { cwd: DATA_DIR, encoding: 'utf8' });

describe('module', () => {
  it('node', (done) => {
    spawn(process.execPath, args.args.concat(['./test/index.test.ts', 'arg']), args.options, (err, res) => {
      assert.equal(cr(err ? err.stdout : res.stdout).split('\n').slice(-2)[0], 'Success!');
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
