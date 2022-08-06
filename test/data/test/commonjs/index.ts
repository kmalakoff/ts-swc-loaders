require('core-js/actual/symbol/for');

const assert = require('assert');
const App = require('./lib/react.tsx');
const string = require('./lib/string.cjs');

describe('commonjs', function () {
  it('react.tsx', function () {
    assert.ok(App);
  });

  it('string.cjs', function () {
    assert.equal(string, 'string');
  });
});
