const assert = require('assert');
const { Cache, cache, fileType, parse, spawn } = require('ts-swc-loaders');

describe('exports .cjs', () => {
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
