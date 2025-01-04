// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import spawn from 'cross-spawn-cb';

// @ts-ignore
import { parse } from 'ts-swc-loaders';

const type = typeof __filename !== 'undefined' ? 'commonjs' : 'module';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', type);

describe('parse', () => {
  describe('happy path', () => {
    it('parses', (done) => {
      const parsed = parse(type, './loader.js', ['./test/index.test.ts'], { cwd: DATA_DIR, env: process.env, encoding: 'utf8' });
      assert.equal(typeof parsed.command, 'string');
      assert.equal(typeof parsed.args[0], 'string');
      assert.equal(typeof parsed.options.cwd, 'string');
      assert.equal(typeof parsed.options.env, 'object');

      spawn(parsed.command, parsed.args, parsed.options, (err, res) => {
        assert.ok(!err, err ? err.message : '');
        assert.ok(!err, err ? err.message : '');
        assert.equal(res.status, 0);
        assert.equal(cr(res.stdout).split('\n').slice(-2)[0], 'Success!');
        done();
      });
    });
  });
});
