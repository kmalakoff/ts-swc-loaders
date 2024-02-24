import path from 'path';
import isBuiltinModule from 'is-builtin-module';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
import extToFormat from './extToFormat.mjs';
import fileType from './fileType.mjs';
import toPath from './toPath.mjs';
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);
const typeFileRegEx = /^[^.]+\.d\.(.*)$/;
async function _getFormat(url, context, next) {
    if (isBuiltinModule(url)) return next(url, context);
    if (!url.startsWith('file://')) return await next(url, context);
    const filePath = toPath(url, context);
    const ext = path.extname(filePath);
    // filtered
    if (!match(filePath)) {
        if (!ext) return {
            format: 'commonjs'
        }; // args bin is cjs in a module
        return await next(url, context);
    }
    // file
    const data = {
        format: extToFormat(ext)
    };
    if (!data.format || [
        '.js',
        '.jsx'
    ].indexOf(ext) >= 0) data.format = fileType(filePath);
    return data;
}
async function _transformSource(source, context, next) {
    if (isBuiltinModule(context.url)) return next(source, context);
    const loaded = await next(source, context);
    const filePath = toPath(context.url);
    const ext = path.extname(filePath);
    // filtered
    if (!match(filePath)) return loaded;
    if (typeFileRegEx.test(filePath)) return {
        source: ''
    };
    if (extensions.indexOf(ext) < 0) return loaded;
    const contents = loaded.source.toString();
    const compiled = cache.getOrUpdate(cache.cachePath(filePath, config), contents, ()=>transformSync(contents, filePath, config));
    return {
        source: compiled.code
    };
}
const major = +process.versions.node.split('.')[0];
export const getFormat = major < 16 ? _getFormat : undefined;
export const transformSource = major < 16 ? _transformSource : undefined;
