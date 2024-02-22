import fs from 'fs';
import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import process from 'process';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import packageType from '../packageType.mjs';
import transformSync from '../transformSync.cjs';
const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';
const indexExtensions = extensions.map((x)=>`index${x}`);
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);
export async function resolve(specifier1, context, defaultResolve) {
    if (specifier1.startsWith('node:')) specifier1 = specifier1.slice(5); // node built-in
    const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
    const url = parentURL ? new URL(specifier1, parentURL).href : new URL(specifier1).href;
    // directory
    if (specifier1.endsWith('/')) {
        const items = fs.readdirSync(specifier1);
        for (const item of items){
            if (indexExtensions.indexOf(item) >= 0) {
                return await resolve(specifier1 + item, context, defaultResolve);
            }
        }
    }
    // default
    const data = await defaultResolve(specifier1, context, defaultResolve);
    if (!data.format) data.format = packageType(url);
    if (specifier1.endsWith('/node_modules/yargs/yargs')) data.format = 'commonjs'; // args bin is cjs in a module
    return data;
}
export async function load(url, context, defaultLoad) {
    if (url.startsWith('node:')) return await defaultLoad(url, context, defaultLoad);
    if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, {
        type: 'json'
    });
    const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
    url = parentURL ? new URL(specifier, parentURL).href : url;
    const loaded = await defaultLoad(url, context, defaultLoad);
    const filePath = fileURLToPath(url);
    const hasSource = loaded.source;
    if (!hasSource) loaded.source = fs.readFileSync(filePath);
    // filter
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
        source: data.code
    };
}
