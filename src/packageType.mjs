import fs from 'fs';
import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';

const packageJSONCache = new Map();
function readPackageJson(path) {
  const existing = packageJSONCache.get(path);
  if (existing !== undefined) return existing;

  try {
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    packageJSONCache.set(path, packageJson);
    return packageJson;
  } catch (_err) {
    packageJSONCache.set(path, null);
    return null;
  }
}

// https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/package_config.js#L103
function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL('./package.json', resolved);
  while (packageJSONUrl) {
    const packageJSONPath = packageJSONUrl.pathname;
    if (packageJSONPath.endsWith('node_modules/package.json')) {
      break;
    }
    const packageConfig = readPackageJson(fileURLToPath(packageJSONUrl));
    if (packageConfig) return packageConfig;

    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL('../package.json', packageJSONUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  return {};
}

export default function packageType(url) {
  if (path.isAbsolute(url)) url = pathToFileURL(url); // windows

  const pkg = getPackageScopeConfig(url);
  return pkg.type || 'commonjs';
}
