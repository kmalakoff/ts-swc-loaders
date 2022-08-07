import 'core-js/actual/symbol/for.js';
import 'core-js/actual/map/index.js';

import assert from 'assert';
import App from './lib/react.tsx';
import string from './lib/string.cjs';

describe('module', function () {
  it('react.tsx', function () {
    assert.ok(App);
  });

  it('string.cjs', function () {
    assert.equal(string, 'string');
  });
});
