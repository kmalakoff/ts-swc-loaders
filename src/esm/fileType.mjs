import path from 'path';
import packageUp from './packageUp.mjs';
function isEntry(filePath, pkg, key) {
  if (pkg.json[key] === undefined) return false;
  const modulePath = path.resolve(pkg.dir, pkg.json[key]);
  if (filePath === modulePath) return true;
  const moduleDir = path.dirname(modulePath);
  if (filePath.startsWith(moduleDir)) return true;
  return false;
}
export default function fileType(filePath) {
  const pkg = packageUp(filePath);
  if (!pkg) return 'commonjs';
  if (isEntry(filePath, pkg, 'module')) return 'module';
  if (isEntry(filePath, pkg, 'main')) return 'commonjs';
  if (pkg.json.type) return pkg.json.type;
  if (pkg.json.module) return 'module';
  if (pkg.json.main) return 'commonjs';
  return 'commonjs';
}
