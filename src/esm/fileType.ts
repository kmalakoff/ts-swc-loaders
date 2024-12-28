import path from 'path';
import startsWith from 'starts-with';
import packageUp from './packageUp.js';

import type { PackageInfo } from '../types.js';

function isEntry(filePath: string, pkg: PackageInfo, key: string) {
  if (pkg.json[key] === undefined) return false;
  const modulePath = path.resolve(pkg.dir, pkg.json[key]);
  if (filePath === modulePath) return true;
  const moduleDir = path.dirname(modulePath);
  if (startsWith(filePath, moduleDir)) return true;
  return false;
}

export default function fileType(filePath: string) {
  const pkg = packageUp(filePath);
  if (!pkg) return 'commonjs';
  if (isEntry(filePath, pkg, 'module')) return 'module';
  if (isEntry(filePath, pkg, 'main')) return 'commonjs';
  if (pkg.json.type) return pkg.json.type;
  if (pkg.json.module) return 'module';
  if (pkg.json.main) return 'commonjs';
  return 'commonjs';
}
