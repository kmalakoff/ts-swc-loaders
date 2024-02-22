const path = require('path');
const DIST = path.resolve(__dirname, '..', '..');
module.exports = function isInternal(test) {
    if (test.startsWith(DIST)) return true;
    if (test.indexOf('/node_modules') >= 0) return true;
    return false;
};
