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

const EXT_TO_FORMAT = {
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

// lazy create
let config = null;
let cache = null;

async function _getFormat(url, context, defaultGetFormat) {
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  if (path.isAbsolute(url)) url = pathToFileURL(url);
  const filePath = url.startsWith('file://') ? url.slice(7) : url;

  // lazy create
  if (!config) config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));

  // skip internals
  if (filePath.startsWith(distPath) || filePath.startsWith(modulesPath)) return { format: packageType(url) };

  if (url.startsWith('file://')) {
    const extension = path.extname(url);
    let format = EXT_TO_FORMAT[extension];
    if (!format) format = config.options.module === ts.ModuleKind.CommonJS ? 'commonjs' : 'module';
    return { format };
  }
  return await defaultGetFormat(url, context, defaultGetFormat);
}

async function _transformSource(source, context, defaultTransformSource) {
  let { url } = context;
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;
  if (path.isAbsolute(url)) url = pathToFileURL(url);
  const filePath = url.startsWith('file://') ? url.slice(7) : url;
  const loaded = await defaultTransformSource(source, context, defaultTransformSource);

  // skip internals
  if (filePath.startsWith(distPath) || filePath.startsWith(modulesPath)) return loaded;

  // lazy create
  if (!config) config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));
  if (!cache) cache = new Cache();

  // filter
  if (filePath.endsWith('.d.ts')) return { source: '' };
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
