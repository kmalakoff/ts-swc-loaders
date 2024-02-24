const path = require('path');

const major = +process.versions.node.split('.')[0];
const version = major >= 14 ? 'local' : 'lts';
const worker = path.resolve(__dirname, 'workers', `transformSync${path.extname(__filename)}`);

let call = null; // break dependencies
module.exports = function transformSync(contents, fileName, config) {
  if (!call) call = require('node-version-call'); // break dependencies

  return call(version, worker, contents, fileName, config);
};
