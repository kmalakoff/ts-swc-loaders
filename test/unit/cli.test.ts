// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';
import resolve from 'resolve';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.cjs');
const MODULE_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

const command = type === 'commonjs' ? 'mocha-compat' : 'mocha';
const commandPath = resolve.sync(`${command}/bin/${command}`);

describe('cli', () => {
  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));

  it('run with cli option', (done) => {
    spawn(CLI, [commandPath, '--watch-extensions', 'ts,tsx', '--no-timeouts', 'test/*.test.ts'], { cwd: DATA_DIR, encoding: 'utf8' }, (err, res) => {
      assert.ok(!err, err ? err.message : '');
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      done();
    });
  });
});
