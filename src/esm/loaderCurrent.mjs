import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import isBuiltinModule from 'is-builtin-module';
import process from 'process';
import { createMatcher, resolveFileSync, toPath, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants.js';
import extensions from '../extensions.mjs';
import Cache from '../lib/Cache.mjs';
import loadTSConfig from '../lib/loadTSConfig.mjs';
import extToFormat from './extToFormat.mjs';
import fileType from './fileType.mjs';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';

const cache = new Cache();
const config = loadTSConfig(process.cwd());
const match = createMatcher(config);

export async function resolve(specifier, context, next) {
  if (isBuiltinModule(specifier)) return next(specifier, context);
  let filePath = toPath(specifier, context);
  const ext = path.extname(filePath);

  // filtered
  if (!match(filePath)) {
    const data = await next(specifier, context);
    if (!data.format) data.format = 'commonjs';
    if (path.isAbsolute(filePath) && !ext) data.format = 'commonjs'; // args bin is cjs in a module
    return data;
  }

  // use default resolve and infer from package type
  filePath = resolveFileSync(specifier, context);
  const data = {
    url: pathToFileURL(filePath).href,
    format: extToFormat(ext),
    shortCircuit: true,
  };
  if (!data.format) data.format = fileType(filePath);
  return data;
}

export async function load(url, context, next) {
  if (isBuiltinModule(url)) return next(url, context);
  if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, { type: 'json' });

  const data = await next(url, context);
  const filePath = toPath(data.responseURL || url, context);
  const ext = path.extname(filePath);
  if (!data.source && data.type === 'module') data.source = await fs.readFile(filePath);

  // filtered
  if (!match(filePath)) return data;
  if (typeFileRegEx.test(filePath))
    return {
      ...data,
      format: 'module',
      source: '',
    };
  if (extensions.indexOf(ext) < 0) return data;

  // transform
  if (!data.source) data.source = await fs.readFile(filePath);
  const contents = data.source.toString();
  const compiled = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return {
    ...data,
    source: compiled.code,
    shortCircuit: true,
  };
}
