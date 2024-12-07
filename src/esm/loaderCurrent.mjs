import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import isBuiltinModule from 'is-builtin-module';
import { createMatcher, transformSync } from 'ts-swc-transform';

import extensions from '../extensions.mjs';
import Cache from '../lib/Cache.mjs';
import loadTSConfig from '../lib/loadTSConfig.mjs';
import extToFormat from './extToFormat.mjs';
import fileType from './fileType.mjs';
import toPath from './toPath.mjs';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';

const cache = new Cache();
const config = loadTSConfig(process.cwd());
const match = createMatcher(config);

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const typeFileRegEx = /^[^.]+\.d\.(.*)$/;
const indexExtensions = extensions.map((x) => `index${x}`);

export async function resolve(specifier, context, next) {
  if (isBuiltinModule(specifier)) return next(specifier, context);
  const filePath = toPath(specifier, context);
  const ext = path.extname(filePath);
  let stats;
  try {
    stats = await fs.stat(filePath);
  } catch (_err) {}

  // filtered
  if (!match(filePath)) {
    const data = await next(specifier, context);
    if (!data.format) data.format = 'commonjs';
    if (path.isAbsolute(filePath) && !ext) data.format = 'commonjs'; // args bin is cjs in a module
    return data;
  }

  // directory
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  if (specifier.endsWith('/') || (stats && stats.isDirectory())) {
    const items = await fs.readdir(filePath);
    const item = items.find((x) => indexExtensions.indexOf(x) >= 0);
    if (item) return await resolve(`${specifier}${specifier.endsWith('/') ? '' : '/'}${item}`, context, next);
  }
  // look up the extension
  else if ((!ext && !moduleRegEx.test(specifier)) || !stats) {
    const fileName = path.basename(filePath).replace(/(\.[^/.]+)+$/, '');
    const items = await fs.readdir(path.dirname(filePath));
    const found = items.find((x) => x.startsWith(fileName) && !typeFileRegEx.test(x) && extensions.indexOf(path.extname(x)) >= 0);
    if (found && path.extname(specifier) !== path.extname(found)) return await resolve(specifier + path.extname(found), context, next);
  }

  // use default resolve and infer from package type
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
