import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import endsWith from 'ends-with';
import isBuiltinModule from 'is-builtin-module';
import { constants, createMatcher, resolveFileSync, toPath, transformSync } from 'ts-swc-transform';

import { typeFileRegEx } from '../constants';
import Cache from '../lib/Cache';
import loadTSConfig from '../lib/loadTSConfig';
import type { Context, Loaded, Loader, Resolved, Resolver } from '../types';
import extToFormat from './extToFormat';
import fileType from './fileType';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major > 16 ? 'importAttributes' : 'importAssertions';

const cache = new Cache();
const config = loadTSConfig(process.cwd());
const match = createMatcher(config);
const { extensions } = constants;

export async function resolve(specifier: string, context: Context, next: Resolver): Promise<Resolved> | null {
  if (isBuiltinModule(specifier)) return next(specifier, context);
  let filePath = toPath(specifier, context);
  const ext = path.extname(filePath);

  // filtered
  if (!match(filePath)) {
    const data = await next(specifier, context);
    if (!data.format) data.format = 'commonjs';
    if (path.isAbsolute(filePath) && !ext) data.format = 'commonjs'; // TODO: look up from package.json args bin is cjs in a module
    return data;
  }

  // use default resolve and infer from package type
  filePath = resolveFileSync(specifier, context);
  if (!filePath) throw new Error(`${specifier} not found. parentURL: ${context.parentURL}`);
  const data = {
    url: pathToFileURL(filePath).href,
    format: extToFormat(ext),
    shortCircuit: true,
  };
  if (!data.format) data.format = fileType(filePath);
  return data;
}

export async function load(url: string, context: Context, next: Loader): Promise<Loaded> {
  if (isBuiltinModule(url)) return next(url, context);
  if (endsWith(url, '.json')) context[importJSONKey] = { ...(context[importJSONKey] || {}), type: 'json' };

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
  if (ext === '.json') return data;
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
