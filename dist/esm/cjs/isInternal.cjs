const path = require('path');
const DIST = path.resolve(__dirname, '..', '..');
const INTERNAL_PATHS = [
    DIST,
    path.resolve(DIST, '..', 'node_modules')
];
module.exports = function isInternal(test) {
    if (test.startsWith(INTERNAL_PATHS[0])) return true;
    if (test.startsWith(INTERNAL_PATHS[1])) return true;
    return false;
};
