var fs = require('fs');
var path = require('path');
var ts = require('typescript');

module.exports = function readConfigSync(configPath) {
  if (!fs.existsSync(configPath)) return null;
  var { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath));
};
