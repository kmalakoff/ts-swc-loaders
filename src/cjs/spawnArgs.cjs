require('../polyfills.cjs');
const createSpawnArgs = require('../createSpawnArgs');

const local = +process.versions.node.split('.')[0];

module.exports = function spawnArgs(type, options, major) {
  return createSpawnArgs(type, options, major || local);
};
