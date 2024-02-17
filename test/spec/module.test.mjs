import process from 'process';
const major = +process.versions.node.split('.')[0];

// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import spawn from 'cross-spawn-cb';
import { spawnArgs } from 'ts-swc-loaders';

import devStack from 'ts-dev-stack';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

describe('module', () => {
  major <= 8 ||
    it('tests', (done) => {
      const { args, options } = spawnArgs('commonjs', { cwd: DATA_DIR, encoding: 'utf8' });
      spawn('node', args.concat(['commonjs/index.ts', 'arg']), options, (err, res) => {
        assert.ok(!err || err.stderr.indexOf('ExperimentalWarning') >= 0);
        assert.equal(res.stdout, 'success: arg\n');
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
