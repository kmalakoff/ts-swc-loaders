import assert from 'assert';
import fs from 'fs';
import { safeRmSync } from 'fs-remove-compat';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import { Cache } from 'ts-swc-loaders';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TEST_CACHE_PATH = path.join(__dirname, '..', '..', '.tmp-cache-test');

describe('Cache', () => {
  let cache: Cache<{ code: string }>;

  before(() => {
    safeRmSync(TEST_CACHE_PATH);
  });

  after(() => {
    safeRmSync(TEST_CACHE_PATH);
  });

  beforeEach(() => {
    safeRmSync(TEST_CACHE_PATH);
    cache = new Cache({ cachePath: TEST_CACHE_PATH, maxAge: 100 }); // 100ms for expiration tests
  });

  afterEach(() => {
    safeRmSync(TEST_CACHE_PATH);
  });

  describe('set and get', () => {
    it('returns cached data on cache hit', () => {
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');
      cache.set(key, { code: 'compiled' }, hash);

      const result = cache.get(key, hash);
      assert.deepEqual(result, { code: 'compiled' });
    });

    it('returns null when hash changes (source modified)', () => {
      const key = cache.key('/test/file.ts', {});
      cache.set(key, { code: 'compiled' }, cache.hash('const x = 1;'));

      const result = cache.get(key, cache.hash('const x = 2;')); // different source
      assert.equal(result, null);
    });

    it('removes stale entry from disk when hash changes', () => {
      const key = cache.key('/test/file.ts', {});
      cache.set(key, { code: 'compiled' }, cache.hash('const x = 1;'));
      assert.ok(fs.existsSync(key));

      cache.get(key, cache.hash('const x = 2;')); // triggers removal
      assert.ok(!fs.existsSync(key));
    });
  });

  describe('expiration', () => {
    it('returns null for expired entries', (done) => {
      const key = cache.key('/test/file.ts', {});
      const hash = cache.hash('const x = 1;');
      cache.set(key, { code: 'compiled' }, hash);

      setTimeout(() => {
        const result = cache.get(key, hash);
        assert.equal(result, null);
        done();
      }, 150); // wait for expiration (maxAge is 100ms)
    });
  });

  describe('error handling', () => {
    it('handles corrupted cache file gracefully', () => {
      const key = cache.key('/test/file.ts', {});
      mkdirp.sync(path.dirname(key));
      fs.writeFileSync(key, 'not valid json', 'utf8');

      const result = cache.get(key, 'somehash');
      assert.equal(result, null); // should not throw
    });

    it('returns null when cache file does not exist', () => {
      const key = cache.key('/test/nonexistent.ts', {});
      const result = cache.get(key, 'somehash');
      assert.equal(result, null);
    });
  });

  describe('key generation', () => {
    it('generates different keys for different files', () => {
      const key1 = cache.key('/test/file1.ts', {});
      const key2 = cache.key('/test/file2.ts', {});
      assert.notEqual(key1, key2);
    });

    it('generates different keys for different options', () => {
      const key1 = cache.key('/test/file.ts', { target: 'es5' });
      const key2 = cache.key('/test/file.ts', { target: 'es6' });
      assert.notEqual(key1, key2);
    });
  });

  describe('hash generation', () => {
    it('generates same hash for same content', () => {
      const hash1 = cache.hash('const x = 1;');
      const hash2 = cache.hash('const x = 1;');
      assert.equal(hash1, hash2);
    });

    it('generates different hash for different content', () => {
      const hash1 = cache.hash('const x = 1;');
      const hash2 = cache.hash('const x = 2;');
      assert.notEqual(hash1, hash2);
    });
  });

  describe('clear', () => {
    it('removes cache directory', () => {
      const key = cache.key('/test/file.ts', {});
      cache.set(key, { code: 'compiled' }, 'hash');
      assert.ok(fs.existsSync(TEST_CACHE_PATH));

      cache.clear({ silent: true });
      assert.ok(!fs.existsSync(TEST_CACHE_PATH));
    });

    it('works when cache directory does not exist', () => {
      safeRmSync(TEST_CACHE_PATH);
      assert.doesNotThrow(() => {
        cache.clear({ silent: true });
      });
    });
  });
});
