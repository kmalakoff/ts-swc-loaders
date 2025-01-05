// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';

// @ts-ignore
import { clean } from 'ts-swc-loaders';

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';
const command = type === 'commonjs' ? 'mocha-compat' : 'mocha';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.cjs');
const MODULE_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(__dirname, '..', 'data', type);
const DATA_MODULE_DIR = path.join(DATA_DIR, 'node_modules');

describe('cli', () => {
  before(linkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  after(unlinkModule.bind(null, MODULE_DIR, DATA_MODULE_DIR));
  beforeEach(() => clean());

  it('run with cli option', (done) => {
    spawn(CLI, [command, '--watch-extensions', 'ts,tsx', '--no-timeouts', 'test/*.test-test.ts'], { cwd: DATA_DIR, encoding: 'utf8' }, (err, res) => {
      console.log(err, res);
      if (err) return done(err);
      console.log(1);
      assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
      console.log(2);
      done();
    });
  });
});
