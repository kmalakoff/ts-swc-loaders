// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';

// @ts-ignore
import { parse } from 'ts-swc-loaders';

const major = +process.versions.node.split('.')[0];
const type = typeof __filename !== 'undefined' ? 'commonjs' : 'module';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

describe(`conventions (${type})`, () => {
  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));

  major > 0 ||
    it('loader', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });

  major <= 0 ||
    it('node', (done) => {
      const parsed = parse(type, process.execPath, ['./test/index.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' });
      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });
});
