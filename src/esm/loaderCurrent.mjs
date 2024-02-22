import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import Cache from '../Cache.mjs';
import createMatcher from '../createMatcher.mjs';
import extensions from '../extensions.mjs';
import loadTSConfig from '../loadTSConfig.mjs';
import packageType from '../packageType.mjs';
import transformSync from '../transformSync.cjs';

const major = +process.versions.node.split('.')[0];
const importJSONKey = major >= 18 ? 'importAttributes' : 'importAssertions';

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

const cache = new Cache();
const config = loadTSConfig(path.resolve(process.cwd(), 'tsconfig.json'));
const match = createMatcher(config);

export async function resolve(specifier, context, next) {
  // if (isBuiltin(specifier)) return next(specifier, context); // TODO: optimize, but not available on older node

  // directory
  if (specifier.endsWith('/')) {
    const items = await fs.readdir(specifier);
    for (const item of items) {
      if (indexExtensions.indexOf(item) >= 0) {
        return await resolve(specifier + item, context, next);
      }
    }
  }
  // no extension and not a module, guess an extension
  else if (!path.extname(specifier) && !moduleRegEx.test(specifier)) {
    // console.log(specifier, context.parentURL);
    // const items = await fs.readdir(specifier); // TODO: search the directory
    for (const ext of extensions) {
      try {
        return await resolve(specifier + ext, context, next);
      } catch (_err) {
        // skip
      }
    }
  }

  const data = await next(specifier, context);
  if (!data.format) data.format = packageType(data.url);
  if (specifier.endsWith('/node_modules/yargs/yargs')) data.format = 'commonjs'; // args bin is cjs in a module
  return {
    ...data,
    shortCircuit: true,
  };
}

export async function load(url, context, next) {
  if (url.startsWith('node:')) return await next(url, context, next);
  if (url.endsWith('.json')) context[importJSONKey] = Object.assign(context[importJSONKey] || {}, { type: 'json' });

  const loaded = await next(url, context);
  const filePath = fileURLToPath(url);
  const hasSource = loaded.source;
  if (!hasSource) loaded.source = await fs.readFile(filePath);

  // filter
  if (!match(filePath)) return loaded;
  if (url.endsWith('.d.ts'))
    return {
      ...loaded,
      format: 'module',
      source: '',
    };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;

  // transform
  const contents = loaded.source.toString();
  const data = cache.getOrUpdate(cache.cachePath(filePath, config), contents, () => transformSync(contents, filePath, config));
  return {
    ...loaded,
    format: hasSource ? 'module' : 'commonjs',
    shortCircuit: true,
    source: data.code,
  };
}
