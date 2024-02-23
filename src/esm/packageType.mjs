import fs from 'fs';
import path from 'path';

const packageJSONCache = new Map();
function readPackageJson(packagePath) {
  const existing = packageJSONCache.get(packagePath);
  if (existing !== undefined) return existing;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJSONCache.set(packagePath, packageJson);
    return packageJson;
  } catch (_err) {
    packageJSONCache.set(packagePath, null);
    return null;
  }
}

function getPackageScopeConfig(filePath) {
  let packageDir = filePath;
  while (packageDir) {
    if (packageDir.endsWith('node_modules')) break;
    const packageConfig = readPackageJson(path.join(packageDir, 'package.json'));
    if (packageConfig) return packageConfig;

    const prev = packageDir;
    packageDir = path.dirname(packageDir);
    if (packageDir === '' || packageDir === prev) break;
  }
  return {};
}

export default function packageType(filePath) {
  const pkg = getPackageScopeConfig(filePath);
  return pkg.type || 'commonjs';
}
