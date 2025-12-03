import { promises as fs } from 'fs';
import isBuiltinModule from 'is-builtin-module';
import path from 'path';
import match from 'test-match';
import { constants, resolveFileSync, toPath, transformSync } from 'ts-swc-transform';
import { pathToFileURL } from 'url';
import cache from '../cache.ts';
import { stringEndsWith } from '../compat.ts';
import { typeFileRegEx } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';
import type { LoadContext, Loaded, Loader, ResolveContext, Resolved, Resolver } from '../types.ts';
import extToFormat from './extToFormat.ts';
import fileType from './fileType.ts';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major > 16 ? 'importAttributes' : 'importAssertions';

const tsconfig = loadTSConfig(process.cwd());
const matcher = match({
  cwd: path.dirname(tsconfig.path),
  include: tsconfig.config.include as string[],
  exclude: tsconfig.config.exclude as string[],
});
const { extensions } = constants;

export async function resolve(specifier: string, context: ResolveContext, next: Resolver): Promise<Resolved> | null {
  if (isBuiltinModule(specifier)) return next(specifier, context);
  let filePath = toPath(specifier, context);
  const ext = path.extname(filePath);

  // filtered
  if (!matcher(filePath)) {
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

export async function load(url: string, context: LoadContext, next: Loader): Promise<Loaded> {
  if (isBuiltinModule(url)) return next(url, context);
  if (stringEndsWith(url, '.json'))
    context[importJSONKey] = {
      ...(context[importJSONKey] || {}),
      type: 'json',
    };

  const data = await next(url, context);
  const filePath = toPath(data.responseURL || url, context);
  const ext = path.extname(filePath);
  if (!data.source && data.type === 'module') data.source = await fs.readFile(filePath);

  // filtered
  if (!matcher(filePath)) return data;
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
  const key = cache.key(filePath, tsconfig);
  const hash = cache.hash(contents);
  const compiled = cache.get(key, hash) || cache.set(key, transformSync(contents, filePath, tsconfig), hash);
  return {
    ...data,
    source: compiled.code,
    shortCircuit: true,
  };
}
