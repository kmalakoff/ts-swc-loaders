var path = require('path-posix');
var slash = require('slash');
var micromatch = require('micromatch');

module.exports = function createMatcher(config) {
  var configPath = path.dirname(slash(config.path));

  function matchFn(condition) {
    var pattern = slash(condition);
    if (!path.isAbsolute(pattern) && !pattern.startsWith('*')) pattern = path.join(configPath, pattern);

    return function match(filePath) {
      return filePath.startsWith(pattern) || micromatch.isMatch(filePath, pattern);
    };
  }

  var includes = (config.config.include || []).map(matchFn);
  var excludes = (config.config.exclude || []).map(matchFn);

  return function matcher(filePath) {
    if (filePath.endsWith('.json')) return false;

    filePath = slash(filePath);
    for (var i = 0; i < excludes.length; ++i) {
      if (excludes[i](filePath)) return false;
    }
    for (var j = 0; j < includes.length; ++j) {
      if (includes[j](filePath)) return true;
    }
    return !includes.length;
  };
};
