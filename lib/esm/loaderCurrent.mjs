import fs from 'fs';
import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import getTS from 'get-tsconfig-compat';
import process from 'process';

import Cache from '../Cache.js';
import createMatcher from '../createMatcher.js';
import extensions from '../extensions.js';
import packageType from '../packageType.js';
import transformSync from '../transformSync.js';

var major = +process.versions.node.split('.')[0];
var importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';

var INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
var isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

var moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
var indexExtensions = extensions.map((x) => 'index' + x);

var cache = new Cache();
var config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
var match = createMatcher(config);

export var resolve = async (specifier, context, defaultResolve) => {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5); // node built-in
  var parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  var url = parentURL ? new URL(specifier, parentURL).href : new URL(specifier).href;

  // resolve from extension or as a module
  if (path.extname(specifier) || moduleRegEx.test(specifier)) {
    var data = await defaultResolve(specifier, context, defaultResolve);
    if (!data.format) data.format = packageType(url);
    return data;
  }

  // directory
  if (specifier.endsWith('/')) {
    var items = fs.readdirSync(specifier);
    for (var item of items) {
      if (indexExtensions.indexOf(item) >= 0) {
        return await resolve(specifier + item, context, defaultResolve);
      }
    }
  }

  // guess extension
  else {
    for (var ext of extensions) {
      try {
        return await resolve(specifier + ext, context, defaultResolve);
      } catch (_err) {
        // skip
      }
    }
  }

  throw new Error(`Cannot resolve: ${specifier}`);
};

export var load = async (url, context, defaultLoad) => {
  if (url.startsWith('node:')) return await defaultLoad(url, context, defaultLoad);
  if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, { type: 'json' });

  var parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;

  var loaded = await defaultLoad(url, context, defaultLoad);
  var filePath = fileURLToPath(url);
  var hasSource = loaded.source;
  if (!hasSource) loaded.source = fs.readFileSync(filePath);

  // filter
  if (isInternal(url)) return loaded;
  if (url.endsWith('.d.ts')) return { ...loaded, format: 'module', source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!match(filePath)) return loaded;

  // transform
  var contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));

  return {
    ...loaded,
    format: hasSource ? 'module' : 'commonjs',
    source: data.code,
  };
};
