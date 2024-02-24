import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import resolve from 'resolve';
import packageUp from './packageUp.mjs';

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

export default function toPath(x, context) {
  if (x.startsWith('file://')) return fileURLToPath(x);
  if (path.isAbsolute(x)) return x;
  if (x[0] === '.') {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    const parentPath = context && context.parentURL ? path.dirname(toPath(context.parentURL)) : process.cwd();
    return path.resolve(parentPath, x);
  }
  if (moduleRegEx.test(x)) {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    const parentPath = context && context.parentURL ? path.dirname(toPath(context.parentURL)) : process.cwd();
    const main = resolve.sync(x, {
      basedir: parentPath,
      extensions: ['.js', '.json', '.node', '.mjs'],
    });
    const pkg = packageUp(main);
    if (!pkg || !pkg.json.module) return main;

    // try resolving as a module
    const modulePath = path.resolve(path.dirname(pkg.path), pkg.json.module);
    if (pkg.json.name === x) return modulePath; // the module

    // a relative path. Only accept if it doesn't break the relative naming and it exists
    const mainPath = path.resolve(path.dirname(pkg.path), pkg.json.main);
    const moduleResolved = path.resolve(modulePath, path.relative(mainPath, main));
    return moduleResolved.indexOf(x.replace(pkg.json.name, '')) < 0 || !fs.existsSync(moduleResolved) ? main : moduleResolved;
  }

  return x;
}
