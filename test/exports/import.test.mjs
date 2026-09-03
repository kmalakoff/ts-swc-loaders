import assert from 'assert';
import { Cache, cache, fileType, parse, spawn } from 'ts-swc-loaders';

describe('exports .mjs', () => {
  it('cache', () => {
    assert.equal(typeof cache, 'object');
  });
  it('fileType', () => {
    assert.equal(typeof fileType, 'function');
  });
  it('Cache', () => {
    assert.equal(typeof Cache, 'function');
  });
  it('parse', () => {
    assert.equal(typeof parse, 'function');
  });
  it('spawn', () => {
    assert.equal(typeof spawn, 'function');
  });
});
