import assert from 'assert';
import fs from 'fs';
import { safeRmSync } from 'fs-remove-compat';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import { Cache } from 'ts-swc-loaders';
import url from 'url';
import { COMPILERS } from '../../../src/constants.ts';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TEST_CACHE_PATH = path.join(__dirname, '..', '..', '..', '.tmp', 'cache-unit');

describe('Cache', () => {
  let cache: Cache<{ code: string }>;

  beforeEach(() => {
    safeRmSync(TEST_CACHE_PATH);
    cache = new Cache({ cachePath: TEST_CACHE_PATH });
  });

  after(() => {
    safeRmSync(TEST_CACHE_PATH);
  });

  describe('set and get', () => {
    it('returns cached data on cache hit', () => {
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');
      assert.deepEqual(cache.set(key, { code: 'compiled' }, hash), { code: 'compiled' });
      assert.deepEqual(cache.get(key, hash), { code: 'compiled' });
    });

    it('writes one .json entry and no temporary files', () => {
      cache.set(cache.key('/test/file.ts', {}), { code: 'compiled' }, cache.hash('const x = 1;'));
      const names = fs.readdirSync(TEST_CACHE_PATH);
      assert.equal(names.length, 1);
      assert.ok(/^[0-9a-f]{64}\.json$/.test(names[0]), names[0]);
    });

    it('misses when the content changes, keeping the old entry', () => {
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');
      cache.set(key, { code: 'compiled' }, hash);

      assert.equal(cache.get(key, cache.hash('const x = 2;')), null);
      assert.deepEqual(cache.get(key, hash), { code: 'compiled' });
    });

    it('misses when the options change', () => {
      const hash = cache.hash('const x = 1;');
      cache.set(cache.key('/test/file.ts', { target: 'es5' }), { code: 'compiled' }, hash);
      assert.equal(cache.get(cache.key('/test/file.ts', { target: 'es6' }), hash), null);
    });

    it('misses when the path changes', () => {
      const hash = cache.hash('const x = 1;');
      cache.set(cache.key('/a/file.ts', {}), { code: 'compiled' }, hash);
      assert.equal(cache.get(cache.key('/b/file.ts', {}), hash), null);
    });

    it('ignores maxAge', (done) => {
      const aged = new Cache<{ code: string }>({ cachePath: TEST_CACHE_PATH, maxAge: 10 });
      const key = aged.key('/test/file.ts', {});
      const hash = aged.hash('const x = 1;');
      aged.set(key, { code: 'compiled' }, hash);
      setTimeout(() => {
        assert.deepEqual(aged.get(key, hash), { code: 'compiled' });
        done();
      }, 50);
    });
  });

  describe('compiler versions', () => {
    it('lists ts-swc-transform and the compilers it resolves', () => {
      const version = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'node_modules', 'ts-swc-transform', 'package.json'), 'utf8')).version;
      assert.equal(COMPILERS[0], `ts-swc-transform@${version}`);
      assert.deepEqual(
        COMPILERS.slice(1).map((entry) => entry.split('@').slice(0, -1).join('@')),
        ['@swc/core', '@swc/wasm', 'typescript', 'ts-node']
      );
      assert.ok(/^typescript@\d/.test(COMPILERS[3]), COMPILERS[3]);
    });

    it('are part of the key', () => {
      const key = cache.key('/test/file.ts', {});
      assert.ok(/^[0-9a-f]{64}$/.test(key));
      assert.notEqual(key, cache.key('/test/file.ts', { compilers: 'other' }));
    });
  });

  describe('error handling', () => {
    it('treats a corrupted entry as a miss', () => {
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');
      cache.set(key, { code: 'compiled' }, hash);
      const name = fs.readdirSync(TEST_CACHE_PATH)[0];
      fs.writeFileSync(path.join(TEST_CACHE_PATH, name), 'not valid json', 'utf8');

      assert.equal(cache.get(key, hash), null);
    });

    it('returns null when the entry does not exist', () => {
      assert.equal(cache.get(cache.key('/test/nonexistent.ts', {}), 'somehash'), null);
    });

    it('compiles without writing when the cache path is not a directory', () => {
      mkdirp.sync(path.dirname(TEST_CACHE_PATH));
      fs.writeFileSync(TEST_CACHE_PATH, 'a plain file', 'utf8');
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');

      assert.deepEqual(cache.set(key, { code: 'compiled' }, hash), { code: 'compiled' });
      assert.equal(cache.get(key, hash), null);
      assert.equal(fs.readFileSync(TEST_CACHE_PATH, 'utf8'), 'a plain file');
    });

    it('recreates a folder the operating system removed', () => {
      const hash = cache.hash('const x = 1;');
      cache.set(cache.key('/a.ts', {}), { code: 'a' }, hash);
      safeRmSync(TEST_CACHE_PATH);
      cache.set(cache.key('/b.ts', {}), { code: 'b' }, hash); // lands in the removed folder: lost
      cache.set(cache.key('/c.ts', {}), { code: 'c' }, hash);
      assert.deepEqual(cache.get(cache.key('/c.ts', {}), hash), { code: 'c' });
    });
  });

  describe('hash generation', () => {
    it('generates same hash for same content', () => {
      assert.equal(cache.hash('const x = 1;'), cache.hash('const x = 1;'));
    });

    it('generates different hash for different content', () => {
      assert.notEqual(cache.hash('const x = 1;'), cache.hash('const x = 2;'));
    });
  });

  describe('clear', () => {
    it('removes cache directory and keeps working afterwards', () => {
      const key = cache.key('/test/file.ts', {});
      cache.set(key, { code: 'compiled' }, 'hash');
      assert.ok(fs.existsSync(TEST_CACHE_PATH));

      cache.clear({ silent: true });
      assert.ok(!fs.existsSync(TEST_CACHE_PATH));

      cache.set(key, { code: 'compiled' }, 'hash');
      assert.deepEqual(cache.get(key, 'hash'), { code: 'compiled' });
    });

    it('works when cache directory does not exist', () => {
      assert.doesNotThrow(() => {
        cache.clear({ silent: true });
      });
    });
  });
});
