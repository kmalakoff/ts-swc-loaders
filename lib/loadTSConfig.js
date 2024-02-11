var getTS = require('get-tsconfig-compat');

module.exports = function loadTSConfig(path) {
  var config = getTS.getTsconfig(path);
  if (!config) {
    console.log('tsconfig.json not found at: ' + path);
    config = {};
  }
  config.path = config.path || '';
  config.config = config.config || {};
  config.config.compilerOptions = config.config.compilerOptions || {};
  config.config.include = config.config.include || [];
  return config;
};
