import minimatch from 'minimatch';
import path from 'path-posix';
import slash from 'slash';

export default function createMatcher(config) {
  const configPath = path.dirname(slash(config.path));

  function matchFn(condition) {
    let pattern = slash(condition);
    if (!path.isAbsolute(pattern) && !pattern.startsWith('*')) pattern = path.join(configPath, pattern);

    return function match(filePath) {
      return filePath.startsWith(pattern) || minimatch(filePath, pattern);
    };
  }

  const includes = (config.config.include || []).map(matchFn);
  const excludes = (config.config.exclude || []).map(matchFn);

  return function matcher(filePath) {
    if (filePath.endsWith('.json')) return false;

    filePath = slash(filePath);
    for (let i = 0; i < excludes.length; ++i) {
      if (excludes[i](filePath)) return false;
    }
    for (let j = 0; j < includes.length; ++j) {
      if (includes[j](filePath)) return true;
    }
    return !includes.length;
  };
}
