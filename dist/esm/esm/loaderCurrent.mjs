import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
import packageType from './packageType.mjs';
import toPath from './toPath.mjs';
const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';
const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x)=>`index${x}`);
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);
export async function resolve(specifier, context, next) {
    if (specifier.startsWith('node:')) return next(specifier, context); // TODO: optimize, but isBuiltin not available on older node
    const filePath = toPath(specifier, context);
    // filtered
    if (!match(filePath)) {
        const data = await next(specifier, context);
        if (!data.format) data.format = 'commonjs';
        if (path.isAbsolute(filePath) && !path.extname(filePath)) data.format = 'commonjs'; // args bin is cjs in a module
        return data;
    }
    // directory
    if (specifier.endsWith('/')) {
        const items = await fs.readdir(filePath);
        for (const item of items){
            if (indexExtensions.indexOf(item) >= 0) {
                return await resolve(specifier + item, context, next);
            }
        }
    } else if (!path.extname(specifier) && !moduleRegEx.test(specifier)) {
        const fileName = path.basename(filePath);
        const items = await fs.readdir(path.dirname(filePath));
        const found = items.find((x)=>x.startsWith(fileName) && extensions.indexOf(path.extname(x)) >= 0);
        if (found) return await resolve(specifier + path.extname(found), context, next);
    }
    // use default resolve and infer from package type
    const data = await next(specifier, context);
    if (!data.format) data.format = packageType(filePath);
    return data;
}
export async function load(url, context, next) {
    if (url.startsWith('node:')) return await next(url, context, next);
    if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, {
        type: 'json'
    });
    const loaded = await next(url, context);
    const filePath = toPath(url, context);
    const hasSource = loaded.source;
    if (!hasSource) loaded.source = await fs.readFile(filePath);
    // filtered
    if (!match(filePath)) return loaded;
    if (url.endsWith('.d.ts')) return {
        ...loaded,
        format: 'module',
        source: ''
    };
    if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
    // transform
    const contents = loaded.source.toString();
    const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, ()=>transformSync(contents, filePath, config));
    return {
        ...loaded,
        format: hasSource ? 'module' : 'commonjs',
        source: data.code,
        shortCircuit: true
    };
}
