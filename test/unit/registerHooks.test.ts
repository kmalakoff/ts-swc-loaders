import assert from 'assert';
import Module from 'module';

import { registerSyncHooks } from '../../src/esm/registerHooks.ts';

describe('registerSyncHooks', () => {
  const hasRegisterHooks = typeof Module.registerHooks === 'function';

  it('is exported as a function', () => {
    assert.equal(typeof registerSyncHooks, 'function');
  });

  (hasRegisterHooks ? it : it.skip)('returns true when Module.registerHooks is available', () => {
    // Note: We can't easily verify the hooks were registered without side effects,
    // but we can verify the function doesn't throw and returns the expected value.
    // The actual hook behavior is tested via integration tests (generic.ts fixtures).
    const result = registerSyncHooks();
    assert.equal(result, true);
  });

  (hasRegisterHooks ? it.skip : it)('returns false when Module.registerHooks is not available', () => {
    const result = registerSyncHooks();
    assert.equal(result, false);
  });
});
