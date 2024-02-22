import path from 'path';
import { URL, fileURLToPath, pathToFileURL } from 'url';

import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import packageType from '../packageType.mjs';
import transformSync from '../transformSync.cjs';
import isInternal from './isInternal.mjs';

const EXT_TO_FORMAT = {
  '.json': 'json',
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);

async function _getFormat(url, context, defaultGetFormat) {
  const parentURL = context.parentURL && path.isAbsolute(context.parentURL) ? pathToFileURL(context.parentURL) : context.parentURL; // windows
  url = parentURL ? new URL(specifier, parentURL).href : url;

  // internals
  if (isInternal(url)) return { format: packageType(url) };

  // file
  if (url.startsWith('file://')) {
    let format = EXT_TO_FORMAT[path.extname(url)];
    if (!format) format = packageType(url);
    if (url.endsWith('/node_modules/yargs/yargs')) format = 'commonjs'; // args bin is cjs in a module
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
  if (!match(filePath)) return loaded;

  const contents = loaded.source.toString();
  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));

  return {
    source: data.code,
  };
}

const major = +process.versions.node.split('.')[0];

export const getFormat = major < 16 ? _getFormat : undefined;
export const transformSource = major < 16 ? _transformSource : undefined;
