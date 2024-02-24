import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import isBuiltinModule from 'is-builtin-module';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
import extToFormat from './extToFormat.mjs';
import fileType from './fileType.mjs';
import toPath from './toPath.mjs';
const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);
const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const typeFileRegEx = /^[^.]+\.d\.(.*)$/;
const indexExtensions = extensions.map((x)=>`index${x}`);
export async function resolve(specifier, context, next) {
    if (isBuiltinModule(specifier)) return next(specifier, context);
    const filePath = toPath(specifier, context);
    const ext = path.extname(filePath);
    let stats;
    try {
        stats = await fs.stat(filePath);
    } catch (_err) {}
    // filtered
    if (!match(filePath)) {
        const data = await next(specifier, context);
        if (!data.format) data.format = 'commonjs';
        if (path.isAbsolute(filePath) && !ext) data.format = 'commonjs'; // args bin is cjs in a module
        return data;
    }
    // directory
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (specifier.endsWith('/') || stats && stats.isDirectory()) {
        const items = await fs.readdir(filePath);
        const item = items.find((x)=>indexExtensions.indexOf(x) >= 0);
        if (item) return await resolve(`${specifier}${specifier.endsWith('/') ? '' : '/'}${item}`, context, next);
    } else if (!ext && !moduleRegEx.test(specifier) || !stats) {
        const fileName = path.basename(filePath).replace(/(\.[^/.]+)+$/, '');
        const items = await fs.readdir(path.dirname(filePath));
        const found = items.find((x)=>x.startsWith(fileName) && !typeFileRegEx.test(x) && extensions.indexOf(path.extname(x)) >= 0);
        if (found) return await resolve(specifier + path.extname(found), context, next);
    }
    // use default resolve and infer from package type
    const data = {
        url: pathToFileURL(filePath).href,
        format: extToFormat(ext),
        shortCircuit: true
    };
    if (!data.format) data.format = fileType(filePath);
    return data;
}
export async function load(url, context, next) {
    if (isBuiltinModule(url)) return next(url, context);
    if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, {
        type: 'json'
    });
    const loaded = await next(url, context);
    const filePath = toPath(loaded.responseURL || url, context);
    const ext = path.extname(filePath);
    // filtered
    if (!match(filePath)) return loaded;
    if (typeFileRegEx.test(filePath)) return {
        ...loaded,
        format: 'module',
        source: ''
    };
    if (extensions.indexOf(ext) < 0) return loaded;
    // transform
    if (!loaded.source) loaded.source = await fs.readFile(filePath);
    const contents = loaded.source.toString();
    const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, ()=>transformSync(contents, filePath, config));
    return {
        ...loaded,
        source: data.code,
        shortCircuit: true
    };
}
