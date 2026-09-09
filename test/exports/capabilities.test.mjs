import assert from 'assert';
import { supportsRequireTypeScript } from 'ts-swc-loaders/capabilities';

describe('exports ./capabilities from ESM', () => {
  it('exports a boolean capability', () => {
    assert.equal(typeof supportsRequireTypeScript, 'boolean');
  });
});
