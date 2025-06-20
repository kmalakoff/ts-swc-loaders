import fs from 'fs';
import moduleRoot from 'module-root-sync';
import path from 'path';
import type { PackageInfo, PackageJSON } from '../types.ts';

const cache = {};

export default function packageUp(filePath: string): PackageInfo | null {
  const stat = fs.statSync(filePath);
  const dir = stat.isDirectory() ? filePath : path.dirname(filePath);

  if (cache[dir] === undefined) {
    try {
      const root = moduleRoot(dir);
      cache[dir] = { dir, json: JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as PackageJSON };
    } catch (_) {
      cache[dir] = null;
    }
  }
  return cache[dir];
}
