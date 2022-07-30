import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import ts from 'ts-constants';

import extensions from '../extensions.js';
import readConfigSync from '../readConfigSync.js';
import transformSync from '../transformSync.js';
import needsCompile from '../needsCompile.js';
import packageType from '../packageType.js';
import Cache from '../cache.js';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const distPath = path.resolve(__dirname, '..');
const modulesPath = path.resolve(__dirname, '..', '..', 'node_modules');

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

// lazy create
let config = null;
let cache = null;

export const resolve = async function (specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5);
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  const url = parentURL ? new URL(specifier, parentURL).href : new URL(specifier).href;
  if (path.isAbsolute(url)) url = pathToFileURL(url);
  const filePath = url.startsWith('file://') ? url.slice(7) : url;

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

  // lazy create
  if (!config) config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));

  // resolve
  const data = await defaultResolve(specifier, context, defaultResolve);
  if (!data.format) {
    // skip internals
    if (filePath.startsWith(distPath) || filePath.startsWith(modulesPath)) {
      data.format = packageType(url);
    } else {
      data.format = config.options.module === ts.ModuleKind.CommonJS ? 'commonjs' : 'module';
    }
  }
  return data;
};

export const load = async function (url, context, defaultLoad) {
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  if (path.isAbsolute(url)) url = pathToFileURL(url);
  const filePath = url.startsWith('file://') ? url.slice(7) : url;

  const loaded = await defaultLoad(url, context, defaultLoad);
  if (!loaded.source) return loaded;

  // skip internals
  if (filePath.startsWith(distPath) || filePath.startsWith(modulesPath)) return loaded;

  // lazy create
  if (!config) config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));
  if (!cache) cache = new Cache();

  // filter
  if (filePath.endsWith('.d.ts')) return { format: 'module', source: '' };
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
