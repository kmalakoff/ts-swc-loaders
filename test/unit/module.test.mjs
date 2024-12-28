// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';

import { parse } from 'ts-swc-loaders';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const type = 'module';
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

describe('module', () => {
  it('node', (done) => {
    const parsed = parse(type, process.execPath, ['./test/index.test.ts', 'arg'], { cwd: DATA_DIR, encoding: 'utf8' });
    spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
      assert.ok(!err, err ? err.message : '');
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });

  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
});
