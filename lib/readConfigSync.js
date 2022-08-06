var path = require('path');

var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var worker = path.resolve(__dirname, 'workers', 'readConfigSync.js');

var call = null; // break dependencies
module.exports = function readConfigSync(configPath) {
  if (!call) call = require('node-version-call'); // break dependencies

  return call(version, worker, configPath);
};
