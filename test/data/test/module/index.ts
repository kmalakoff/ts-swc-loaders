import 'core-js/actual/map/index.js';
import 'core-js/actual/symbol/for.js';

import assert from 'assert';
import App from './lib/react.tsx';
import string from './lib/string.cjs';

describe('module', () => {
  it('react.tsx', () => {
    assert.ok(App);
  });

  it('string.cjs', () => {
    assert.equal(string, 'string');
  });
});
