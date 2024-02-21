const path = require('path');

const DIST = path.resolve(__dirname, '..', '..');
const INTERNAL_PATHS = [DIST, path.resolve(DIST, '..', 'node_modules')];
module.exports = function isInternal(test) {
  if (test.indexOf(INTERNAL_PATHS[0]) === 0) return true;
  if (test.indexOf(INTERNAL_PATHS[1]) === 0) return true;
  return false;
};
