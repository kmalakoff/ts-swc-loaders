import fs from 'fs';
import moduleRoot from 'module-root-sync';
import path from 'path';
import startsWith from 'starts-with';

function isEntry(contents: Record<string, string>, key: string, packageDir: string, filePath: string) {
  if (contents[key] === undefined) return false;
  const modulePath = path.join(packageDir, contents[key] as string);
  if (filePath === modulePath) return true;
  const moduleDir = path.dirname(modulePath);
  if (startsWith(filePath, moduleDir)) return true;
  return false;
}

function classifyPackage(packageDir: string, filePath: string): string {
  const contents = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  if (isEntry(contents, 'module', packageDir, filePath)) return 'module';
  if (isEntry(contents, 'main', packageDir, filePath)) return 'commonjs';
  if (contents.type) return contents.type as string;
  if (contents.module) return 'module';
  if (contents.main) return 'commonjs';
  return 'commonjs';
}

const cache: Record<string, string> = {};

export default function fileType(filePath: string): string {
  const fileDir = path.dirname(filePath);
  if (cache[fileDir] !== undefined) return cache[fileDir]; // already cached

  const packageDir = moduleRoot(fileDir);
  const type = packageDir ? classifyPackage(packageDir, filePath) : 'commonjs';
  cache[fileDir] = type;
  cache[packageDir] = type;
  return type;
}
