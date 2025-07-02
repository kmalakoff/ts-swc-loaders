import isBuiltinModule from 'is-builtin-module';
import path from 'path';
import startsWith from 'starts-with';
import match from 'test-match';
import { constants, toPath, transformSync } from 'ts-swc-transform';
import cache from '../cache.ts';
import { typeFileRegEx } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';
import type { FormatContext, Formatted, Formatter, TransformContext, Transformed, Transformer } from '../types.ts';
import extToFormat from './extToFormat.ts';
import fileType from './fileType.ts';

const tsconfig = loadTSConfig(process.cwd());
const matcher = match({ cwd: path.dirname(tsconfig.path), include: tsconfig.config.include as string[], exclude: tsconfig.config.exclude as string[] });
const { extensions } = constants;

async function _getFormat(url: string, context: FormatContext, next: Formatter): Promise<Formatted> {
  if (isBuiltinModule(url)) return next(url, context);
  if (!startsWith(url, 'file://')) return await next(url, context);
  const filePath = toPath(url, context);
  const ext = path.extname(filePath);

  // filtered
  if (!matcher(filePath)) {
    if (!ext) return { format: 'commonjs' }; // args bin is cjs in a module
    return await next(url, context);
  }

  // file
  const data = { format: extToFormat(ext) };
  if (!data.format || ['.js', '.jsx'].indexOf(ext) >= 0) data.format = fileType(filePath);
  return data;
}

async function _transformSource(source: string, context: TransformContext, next: Transformer): Promise<Transformed> {
  if (isBuiltinModule(context.url)) return next(source, context);
  const loaded = await next(source, context);
  const filePath = toPath(context.url);
  const ext = path.extname(filePath);

  // filtered
  if (!matcher(filePath)) return loaded;
  if (typeFileRegEx.test(filePath)) return { source: '' };
  if (ext === '.json') return loaded;
  if (extensions.indexOf(ext) < 0) return loaded;

  const contents = loaded.source.toString();
  const key = cache.key(filePath, tsconfig);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, tsconfig), hash);
  return {
    source: compiled.code,
  };
}

const major = +process.versions.node.split('.')[0];
export const getFormat = major > 14 ? undefined : _getFormat;
export const transformSource = major > 14 ? undefined : _transformSource;
