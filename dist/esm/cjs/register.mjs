import path from 'path';
import pirates from 'pirates';
import '../polyfills.cjs';
import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import transformSync from '../transformSync.cjs';
const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.module = 'CommonJS';
config.config.compilerOptions.target = 'ES5';
const match = createMatcher(config);
const typeFileRegEx = /^[^.]+\.d\.(.*)$/;
export function register(options, hookOpts) {
    options = options || {};
    return pirates.addHook((code, filePath)=>compile(code, filePath, options), Object.assign({
        exts: extensions
    }, hookOpts || {}));
}
export function compile(contents, filePath) {
    const ext = path.extname(filePath);
    // filter
    if (!match(filePath)) return contents || ' ';
    if (typeFileRegEx.test(filePath)) return ' ';
    if (extensions.indexOf(ext) < 0) return contents || ' ';
    const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, ()=>transformSync(contents, filePath, config));
    return data.code;
}
