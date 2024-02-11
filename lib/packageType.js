var path = require('path');
var { URL, fileURLToPath, pathToFileURL } = require('url');

var packageJSONCache = new Map();
function readPackageJson(path) {
  var existing = packageJSONCache.get(path);
  if (existing !== undefined) return existing;

  try {
    var packageJson = require(path);
    packageJSONCache.set(path, packageJson);
    return packageJson;
  } catch (_err) {
    packageJSONCache.set(path, null);
    return null;
  }
}

// https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/package_config.js#L103
function getPackageScopeConfig(resolved) {
  var packageJSONUrl = new URL('./package.json', resolved);
  while (packageJSONUrl) {
    var packageJSONPath = packageJSONUrl.pathname;
    if (packageJSONPath.endsWith('node_modules/package.json')) {
      break;
    }
    var packageConfig = readPackageJson(fileURLToPath(packageJSONUrl));
    if (packageConfig) return packageConfig;

    var lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL('../package.json', packageJSONUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  return {};
}

module.exports = function packageType(url) {
  if (path.isAbsolute(url)) url = pathToFileURL(url); // windows

  var pkg = getPackageScopeConfig(url);
  return pkg.type || 'commonjs';
};
