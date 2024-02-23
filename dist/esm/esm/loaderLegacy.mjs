import path from 'path';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
import packageType from './packageType.mjs';
import toPath from './toPath.mjs';
const EXT_TO_FORMAT = {
    '.json': 'json',
    '.mjs': 'module',
    '.mts': 'module',
    '.cjs': 'commonjs',
    '.cts': 'commonjs'
};
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);
async function _getFormat(url, context, next) {
    if (!url.startsWith('file://')) return await next(url, context);
    const filePath = toPath(url, context);
    // filtered
    if (!match(filePath)) {
        if (!path.extname(filePath)) return {
            format: 'commonjs'
        }; // args bin is cjs in a module
        return await next(url, context);
    }
    // file
    const data = {
        format: EXT_TO_FORMAT[path.extname(url)]
    };
    if (!data.format) data.format = await packageType(filePath);
    return data;
}
async function _transformSource(source, context, next) {
    const loaded = await next(source, context);
    const filePath = toPath(context.url);
    // filtered
    if (!match(filePath)) return loaded;
    if (filePath.endsWith('.d.ts')) return {
        source: ''
    };
    if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
    const contents = loaded.source.toString();
    const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, ()=>transformSync(contents, filePath, config));
    return {
        source: data.code
    };
}
const major = +process.versions.node.split('.')[0];
export const getFormat = major < 16 ? _getFormat : undefined;
export const transformSource = major < 16 ? _transformSource : undefined;
