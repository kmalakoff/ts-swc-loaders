const path = require('path');

const DIST = path.resolve(__dirname, '..', '..');
const INTERNAL_PATHS = [DIST, path.resolve(DIST, '..', 'node_modules')];
module.exports = function isInternal(x) {
  return INTERNAL_PATHS.some((y) => x.startsWith(y));
}
