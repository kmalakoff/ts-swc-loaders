import fs from 'fs';
import path from 'path';
import { URL, pathToFileURL, fileURLToPath } from 'url';

import Cache from '../Cache.js';
import extensions from '../extensions.js';
import needsCompile from '../needsCompile.js';
import packageType from '../packageType.js';
import readConfigSync from '../readConfigSync.js';
import transformSync from '../transformSync.js';

const INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
const isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

const cache = new Cache();
const config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));

export const resolve = async function (specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5);
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
  if (url.endsWith('.json')) {
    context.importAssertions = context.importAssertions || {};
    context.importAssertions.type = 'json';
  }

  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  const loaded = await defaultLoad(url, context, defaultLoad);
  if (!loaded.source) return loaded;
  const filePath = fileURLToPath(url);

  // filter
  if (isInternal(url)) return loaded;
  if (url.endsWith('.d.ts')) return { format: 'module', source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!needsCompile(filePath, config)) return loaded;

  const contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, config.options), contents, function () {
    return transformSync(contents, filePath, config.options);
  });

  return {
    format: 'module',
    source: data.code,
  };
};
