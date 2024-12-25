// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { runCommand } from 'ts-dev-stack';
import { spawnParams } from 'ts-swc-loaders';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const type = 'module';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules', 'ts-swc-loaders');

const args = spawnParams(type, { cwd: DATA_DIR, encoding: 'utf8' });

describe('module', () => {
  it('node', (done) => {
    spawn(process.execPath, args.args.concat(['./test/index.test.ts', 'arg']), args.options, (err, res) => {
      assert.ok(!err, err ? err.message : '');
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });

  before(runCommand.bind(null, 'link', [], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }));
  after(runCommand.bind(null, 'unlink', [], { cwd: MODULE_DIR, installPath: DATA_MODULE_DIR }));
});
