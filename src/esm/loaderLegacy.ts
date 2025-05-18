import path from 'path';
import isBuiltinModule from 'is-builtin-module';
import startsWith from 'starts-with';
import { constants, createMatcher, toPath, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants.js';
import loadTSConfig from '../lib/loadTSConfig.js';
import type { Context, Formatted, Formatter } from '../types.js';
import extToFormat from './extToFormat.js';
import fileType from './fileType.js';

import cache from '../cache.js';

const config = loadTSConfig(process.cwd());
const match = createMatcher(config);
const { extensions } = constants;

async function _getFormat(url: string, context: Context, next: Formatter): Promise<Formatted> {
  if (isBuiltinModule(url)) return next(url, context);
  if (!startsWith(url, 'file://')) return await next(url, context);
  const filePath = toPath(url, context);
  const ext = path.extname(filePath);

  // filtered
  if (!match(filePath)) {
    if (!ext) return { format: 'commonjs' }; // args bin is cjs in a module
    return await next(url, context);
  }

  // file
  const data = { format: extToFormat(ext) };
  if (!data.format || ['.js', '.jsx'].indexOf(ext) >= 0) data.format = fileType(filePath);
  return data;
}

async function _transformSource(source, context, next) {
  if (isBuiltinModule(context.url)) return next(source, context);
  const loaded = await next(source, context);
  const filePath = toPath(context.url);
  const ext = path.extname(filePath);

  // filtered
  if (!match(filePath)) return loaded;
  if (typeFileRegEx.test(filePath)) return { source: '' };
  if (ext === '.json') return loaded;
  if (extensions.indexOf(ext) < 0) return loaded;

  const contents = loaded.source.toString();
  const key = cache.key(filePath, config);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, config), hash);
  return {
    source: compiled.code,
  };
}

const major = +process.versions.node.split('.')[0];
export const getFormat = major > 14 ? undefined : _getFormat;
export const transformSource = major > 14 ? undefined : _transformSource;
