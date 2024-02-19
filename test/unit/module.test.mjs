import process from 'process';

// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import spawn from 'cross-spawn-cb';
import { spawnParams } from 'ts-swc-loaders';

import devStack from 'ts-dev-stack';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

describe('module', () => {
  it('node', (done) => {
    const args = spawnParams('module', { cwd: DATA_DIR, encoding: 'utf8' });
    spawn('node', args.args.concat(['./module/index.ts', 'arg']), args.options, (err, res) => {
      const stdout = err ? err.stdout : res.stdout;
      assert.equal(stdout, 'success: arg\n');
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
