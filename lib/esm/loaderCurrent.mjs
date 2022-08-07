import fs from 'fs';
import path from 'path';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import getTS from 'get-tsconfig-compat';

import Cache from '../Cache.js';
import extensions from '../extensions.js';
import createMatcher from '../createMatcher.js';
import packageType from '../packageType.js';
import transformSync from '../transformSync.js';

const INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
const isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

const cache = new Cache();
const config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);

export const resolve = async function (specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5); // node built-in
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  const url = parentURL ? new URL(specifier, parentURL).href : new URL(specifier).href;

  // no extension
  const extension = path.extname(specifier);
  if (!extension) {
    // directory
    if (specifier.endsWith('/')) {
      const items = fs.readdirSync(specifier);
      for (let item of items) {
        if (indexExtensions.indexOf(item) >= 0) {
          return await resolve(specifier + 'index' + extension, context, defaultResolve);
        }
      }
    }

    // a module
    else if (moduleRegEx.test(specifier)) return await defaultResolve(specifier, context, defaultResolve);
    // guess extension
    else {
      for (let extension of extensions) {
        try {
          return await resolve(specifier + extension, context, defaultResolve);
        } catch (err) {
          // skip
        }
      }
    }

    throw new Error('Cannot resolve: ' + specifier);
  }

  // resolve
  const data = await defaultResolve(specifier, context, defaultResolve);
  if (!data.format) data.format = packageType(url);
  return data;
};

export const load = async function (url, context, defaultLoad) {
  if (url.startsWith('node:')) return await defaultLoad(url, context, defaultLoad); // node built-in
  if (url.endsWith('.json')) context.importAssertions = Object.assign(context.importAssertions || {}, { type: 'json' });

  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  const loaded = await defaultLoad(url, context, defaultLoad);
  const filePath = fileURLToPath(url);
  const hasSource = loaded.source;
  if (!hasSource) loaded.source = fs.readFileSync(filePath);

  // filter
  if (isInternal(url)) return loaded;
  if (url.endsWith('.d.ts')) return { ...loaded, format: 'module', source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!match(filePath)) return loaded;

  // transform
  const contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, function () {
    return transformSync(contents, filePath, config);
  });

  return {
    ...loaded,
    format: hasSource ? 'module' : 'commonjs',
    source: data.code,
  };
};
