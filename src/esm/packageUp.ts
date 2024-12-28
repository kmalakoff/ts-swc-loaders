import fs from 'fs';
import path from 'path';
import endsWith from 'ends-with';
import type { PackageInfo, PackageJSON } from '../types.js';

const cache = {};

function getPackage(packagePath: string): PackageJSON | null {
  const existing = cache[packagePath];
  if (existing !== undefined) return existing;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as PackageJSON;
    cache[packagePath] = packageJson;
    return packageJson;
  } catch (_) {
    cache[packagePath] = null;
    return null;
  }
}

export default function packageUp(filePath: string): PackageInfo | null {
  let dir = filePath;
  while (dir) {
    if (endsWith(dir, 'node_modules')) break;
    const json = getPackage(path.join(dir, 'package.json'));
    if (json) return { json, dir };
    dir = path.dirname(dir);
  }
  return null;
}
