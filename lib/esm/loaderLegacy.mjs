import path from 'path';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import ts from 'ts-constants';

import Cache from '../Cache.js';
import extensions from '../extensions.js';
import needsCompile from '../needsCompile.js';
import packageType from '../packageType.js';
import readConfigSync from '../readConfigSync.js';
import transformSync from '../transformSync.js';

const INTERNAL_PATHS = [new URL('..', import.meta.url).href, new URL('../../node_modules', import.meta.url).href];
const isInternal = (x) => INTERNAL_PATHS.some((y) => x.startsWith(y));

const EXT_TO_FORMAT = {
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

const cache = new Cache();
const config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));

async function _getFormat(url, context, defaultGetFormat) {
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;

  // internals
  if (isInternal(url)) return { format: packageType(url) };

  // file
  if (url.startsWith('file://')) {
    const extension = path.extname(url);
    let format = EXT_TO_FORMAT[extension];
    if (!format) format = config.options.module === ts.ModuleKind.CommonJS ? 'commonjs' : 'module';
    return { format };
  }

  // relative
  return await defaultGetFormat(url, context, defaultGetFormat);
}

async function _transformSource(source, context, defaultTransformSource) {
  let { url } = context;
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  const loaded = await defaultTransformSource(source, context, defaultTransformSource);
  const filePath = fileURLToPath(url);

  // filter
  if (isInternal(url)) return loaded;
  if (url.endsWith('.d.ts')) return { source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!needsCompile(filePath, config)) return loaded;

  const contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, config.options), contents, function () {
    return transformSync(contents, filePath, config.options);
  });

  return {
    source: data.code,
  };
}

var major = +process.versions.node.split('.')[0];

export const getFormat = major < 16 ? _getFormat : undefined;
export const transformSource = major < 16 ? _transformSource : undefined;
