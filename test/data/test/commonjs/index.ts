require('core-js/actual/symbol/for');
require('core-js/actual/map');

var assert = require('assert');
var App = require('./lib/react.tsx');
var string = require('./lib/string.cjs');

describe('commonjs', () => {
  it('react.tsx', () => {
    assert.ok(App);
  });

  it('string.cjs', () => {
    assert.equal(string, 'string');
  });
});
