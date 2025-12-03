import assert from 'assert';
import path from 'path';
import { fileType } from 'ts-swc-loaders';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '..', 'data', 'filetypes');

describe('fileType', () => {
  describe('explicit type field', () => {
    it('detects module from type: "module"', () => {
      const result = fileType(path.join(FIXTURES, 'esm-explicit', 'index.js'));
      assert.equal(result, 'module');
    });

    it('detects commonjs from type: "commonjs"', () => {
      const result = fileType(path.join(FIXTURES, 'cjs-explicit', 'index.js'));
      assert.equal(result, 'commonjs');
    });
  });

  describe('inferred from entry fields', () => {
    it('detects module when file is in module entry path', () => {
      const result = fileType(path.join(FIXTURES, 'esm-module-field', 'index.js'));
      assert.equal(result, 'module');
    });

    it('detects commonjs when file is in main entry path', () => {
      const result = fileType(path.join(FIXTURES, 'cjs-main-field', 'index.js'));
      assert.equal(result, 'commonjs');
    });
  });

  describe('fallback behavior', () => {
    it('defaults to commonjs when no indicators present', () => {
      const result = fileType(path.join(FIXTURES, 'no-indicators', 'index.js'));
      assert.equal(result, 'commonjs');
    });
  });

  describe('caching', () => {
    it('returns consistent results for same directory', () => {
      const result1 = fileType(path.join(FIXTURES, 'esm-explicit', 'index.js'));
      const result2 = fileType(path.join(FIXTURES, 'esm-explicit', 'index.js'));
      assert.equal(result1, result2);
    });
  });
});
