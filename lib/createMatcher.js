var path = require('path-posix');
var slash = require('slash');
var micromatch = require('micromatch');

function matchFn(configPath, condition) {
  condition = slash(condition);
  var ext = path.extname(condition);
  var patterns = [path.join(configPath, condition)];

  if (!ext && !path.isAbsolute(condition) && !condition.startsWith('*') && !condition.endsWith('*')) {
    patterns.push(path.join(configPath, condition, '*'));
  }

  return function match(filePath) {
    for (var i = 0; i < patterns.length; ++i) {
      var pattern = patterns[i];
      if (filePath.startsWith(pattern)) return true;
      if (micromatch.isMatch(filePath, pattern)) return true;
    }
    return false;
  };
}

module.exports = function createMatcher(config) {
  var configPath = path.dirname(slash(config.path));
  var includes = (config.config.include || []).map(function (condition) {
    return matchFn(configPath, condition);
  });
  var excludes = (config.config.exclude || []).map(function (condition) {
    return matchFn(configPath, condition);
  });

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
