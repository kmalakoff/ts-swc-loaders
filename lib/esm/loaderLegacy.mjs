import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import getTS from 'get-tsconfig-compat';

import Cache from '../Cache.js';
import createMatcher from '../createMatcher.js';
import extensions from '../extensions.js';
import packageType from '../packageType.js';
import transformSync from '../transformSync.js';

var INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
var isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

var EXT_TO_FORMAT = {
  '.json': 'json',
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

var cache = new Cache();
var config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
var match = createMatcher(config);

async function _getFormat(url, context, defaultGetFormat) {
  var parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;

  // internals
  if (isInternal(url)) return { format: packageType(url) };

  // file
  if (url.startsWith('file://')) {
    var format = EXT_TO_FORMAT[path.extname(url)];
    if (!format) format = packageType(url);
    return { format };
  }

  // relative
  return await defaultGetFormat(url, context, defaultGetFormat);
}

async function _transformSource(source, context, defaultTransformSource) {
  var { url } = context;
  var parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  var loaded = await defaultTransformSource(source, context, defaultTransformSource);
  var filePath = fileURLToPath(url);

  // filter
  if (isInternal(url)) return loaded;
  if (url.endsWith('.d.ts')) return { source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!match(filePath)) return loaded;

  var contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));

  return {
    source: data.code,
  };
}

var major = +process.versions.node.split('.')[0];

export var getFormat = major < 16 ? _getFormat : undefined;
export var transformSource = major < 16 ? _transformSource : undefined;
