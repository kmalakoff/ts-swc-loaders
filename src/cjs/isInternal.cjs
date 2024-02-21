const path = require('path');

const DIST = path.resolve(__dirname, '..', '..');
const INTERNAL_PATHS = [DIST, path.resolve(DIST, '..', 'node_modules')];
module.exports = function isInternal(test) {
  try {
    console.log(INTERNAL_PATHS, test)
    return INTERNAL_PATHS.some((x) => test.startsWith(x));

  } catch (err) {
    console.log(err)
    return false;
  }
}
