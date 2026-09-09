const assert = require('assert');
const { supportsRequireTypeScript } = require('ts-swc-loaders/capabilities');

describe('exports ./capabilities from CJS', () => {
  it('exports a boolean capability', () => {
    assert.equal(typeof supportsRequireTypeScript, 'boolean');
  });
});
