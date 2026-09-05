import assert from 'assert';
import Module from 'module';

import { registerSyncHooks } from '../../../src/esm/registerHooks.ts';

describe('registerSyncHooks', () => {
  const hasRegisterHooks = typeof Module.registerHooks === 'function';

  it('is exported as a function', () => {
    assert.equal(typeof registerSyncHooks, 'function');
  });

  (hasRegisterHooks ? it : it.skip)('returns true when Module.registerHooks is available', () => {
    // Registration has no observable effect beyond this boolean; the hooks' behaviour is covered
    // by test/integration/require.test.ts.
    const result = registerSyncHooks();
    assert.equal(result, true);
  });

  (hasRegisterHooks ? it.skip : it)('returns false when Module.registerHooks is not available', () => {
    const result = registerSyncHooks();
    assert.equal(result, false);
  });
});
