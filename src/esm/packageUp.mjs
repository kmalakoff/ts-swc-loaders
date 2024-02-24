import fs from 'fs';
import path from 'path';

const packageJSONCache = new Map();
function getPackage(packagePath) {
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

export default function packageUp(filePath) {
  let packageDir = filePath;
  while (packageDir) {
    if (packageDir.endsWith('node_modules')) break;
    const packagePath = path.join(packageDir, 'package.json');
    const json = getPackage(packagePath);
    if (json) return { json, path: packagePath };
    packageDir = path.dirname(packageDir);
  }
  return null;
}
