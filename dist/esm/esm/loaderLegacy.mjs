import path from 'path';
import { fileURLToPath } from 'url';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import packageType from '../packageType.mjs';
import transformSync from '../transformSync.cjs';
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
    // file
    if (url.startsWith('file://')) {
        let format = EXT_TO_FORMAT[path.extname(url)];
        if (!format) format = packageType(url);
        if (url.endsWith('/node_modules/yargs/yargs')) format = 'commonjs'; // args bin is cjs in a module
        return {
            format
        };
    }
    // relative
    return await next(url, context);
}
async function _transformSource(source, context, next) {
    const { url } = context;
    const loaded = await next(source, context);
    const filePath = fileURLToPath(url);
    // filter
    if (!match(filePath)) return loaded;
    if (url.endsWith('.d.ts')) return {
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
