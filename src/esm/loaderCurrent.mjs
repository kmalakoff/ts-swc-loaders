import fs from 'fs';
import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import process from 'process';

import Cache from '../Cache.js';
import createMatcher from '../createMatcher.js';
import extensions from '../extensions.js';
import loadTSConfig from '../loadTSConfig.js';
import packageType from '../packageType.js';
import transformSync from './transformSync.js';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';

const INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
const isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5); // node built-in
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  const url = parentURL ? new URL(specifier, parentURL).href : new URL(specifier).href;

  // resolve from extension or as a module
  if (path.extname(specifier) || moduleRegEx.test(specifier)) {
    const data = await defaultResolve(specifier, context, defaultResolve);
    if (!data.format) data.format = packageType(url);
    return data;
  }

  // directory
  if (specifier.endsWith('/')) {
    const items = fs.readdirSync(specifier);
    for (const item of items) {
      if (indexExtensions.indexOf(item) >= 0) {
        return await resolve(specifier + item, context, defaultResolve);
      }
    }
  }

  // guess extension
  else {
    for (const ext of extensions) {
      try {
        return await resolve(specifier + ext, context, defaultResolve);
      } catch (_err) {
        // skip
      }
    }
  }

  throw new Error(`Cannot resolve: ${specifier}`);
}

export async function load(url, context, defaultLoad) {
  if (url.startsWith('node:')) return await defaultLoad(url, context, defaultLoad);
  if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, { type: 'json' });

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
  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));

  return {
    ...loaded,
    format: hasSource ? 'module' : 'commonjs',
    source: data.code,
  };
}
