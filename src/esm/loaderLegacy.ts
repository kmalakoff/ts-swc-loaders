import path from 'path';
import isBuiltinModule from 'is-builtin-module';
import startsWith from 'starts-with';
import { constants, createMatcher, toPath, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants';
import Cache from '../lib/Cache';
import loadTSConfig from '../lib/loadTSConfig';
import type { Context, Formatted, Formatter } from '../types';
import extToFormat from './extToFormat';
import fileType from './fileType';

const major = +process.versions.node.split('.')[0];

const cache = new Cache();
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
  const compiled = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));

  return {
    source: compiled.code,
  };
}

export const getFormat = major > 14 ? undefined : _getFormat;
export const transformSource = major > 14 ? undefined: _transformSource;
