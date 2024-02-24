import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import resolve from 'resolve';
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
        let pkg = null;
        const main = resolve.sync(x, {
            basedir: parentPath,
            extensions: [
                '.js',
                '.json',
                '.node',
                '.mjs'
            ],
            packageFilter (json, dir) {
                pkg = {
                    json,
                    dir
                };
                return json;
            }
        });
        if (!pkg || !pkg.json.module) return main; // no modules, use main
        if (pkg.json.name === x) return path.resolve(pkg.dir, pkg.json.module); // the module
        // a relative path. Only accept if it doesn't break the relative naming and it exists
        const modulePath = path.resolve(pkg.dir, pkg.json.module);
        const mainPath = path.resolve(pkg.dir, pkg.json.main);
        const moduleResolved = path.resolve(modulePath, path.relative(mainPath, main));
        return moduleResolved.indexOf(x.replace(pkg.json.name, '')) < 0 || !fs.existsSync(moduleResolved) ? main : moduleResolved;
    }
    return x;
}
