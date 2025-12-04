import fs from 'fs';
import Module from 'module';
import path from 'path';
import match from 'test-match';
import { constants, resolveFileSync, toPath, transformSync } from 'ts-swc-transform';
import { pathToFileURL } from 'url';
import cache from '../cache.ts';
import { typeFileRegEx } from '../constants.ts';
import loadTSConfig from '../lib/loadTSConfig.ts';
import type { LoadContext, Loaded, ResolveContext, Resolved } from '../types.ts';
import extToFormat from './extToFormat.ts';
import fileType from './fileType.ts';

const tsconfig = loadTSConfig(process.cwd());
const matcher = match({
  cwd: path.dirname(tsconfig.path),
  include: tsconfig.config.include as string[],
  exclude: tsconfig.config.exclude as string[],
});
const { extensions } = constants;

// Synchronous resolve hook for module.registerHooks()
export function resolveSync(specifier: string, context: ResolveContext, nextResolve: (specifier: string, context?: ResolveContext) => Resolved): Resolved {
  // Skip built-in modules
  if (specifier.startsWith('node:') || Module.builtinModules.includes(specifier)) {
    return nextResolve(specifier, context);
  }

  let filePath = toPath(specifier, context);
  const ext = path.extname(filePath);

  // filtered
  if (!matcher(filePath)) {
    const data = nextResolve(specifier, context);
    if (!data.format) data.format = 'commonjs';
    if (path.isAbsolute(filePath) && !ext) data.format = 'commonjs';
    return data;
  }

  // use default resolve and infer from package type
  filePath = resolveFileSync(specifier, context);
  if (!filePath) throw new Error(`${specifier} not found. parentURL: ${context.parentURL}`);
  const data: Resolved = {
    url: pathToFileURL(filePath).href,
    format: extToFormat(ext),
    shortCircuit: true,
  };
  if (!data.format) data.format = fileType(filePath);
  return data;
}

// Synchronous load hook for module.registerHooks()
export function loadSync(url: string, context: LoadContext, nextLoad: (url: string, context?: LoadContext) => Loaded): Loaded {
  // Skip built-in modules
  if (url.startsWith('node:') || Module.builtinModules.includes(url)) {
    return nextLoad(url, context);
  }

  const data = nextLoad(url, context);
  const filePath = toPath(data.responseURL || url, context);
  const ext = path.extname(filePath);

  // Read source if not provided for module type
  if (!data.source && data.format === 'module') {
    try {
      data.source = fs.readFileSync(filePath);
    } catch (_err) {
      // File may not exist or not readable
    }
  }

  // filtered
  if (!matcher(filePath)) return data;
  if (typeFileRegEx.test(filePath)) {
    return {
      ...data,
      format: 'module',
      source: '',
    };
  }
  if (ext === '.json') return data;
  if (extensions.indexOf(ext) < 0) return data;

  // transform
  if (!data.source) {
    try {
      data.source = fs.readFileSync(filePath);
    } catch (_err) {
      return data;
    }
  }
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

// Register synchronous hooks if module.registerHooks is available (Node 22.15+)
// This enables TypeScript transpilation for both import() and require() calls
export function registerSyncHooks(): boolean {
  if (typeof Module.registerHooks === 'function') {
    // Cast hooks since our internal types differ slightly from @types/node
    // but are runtime compatible (same function signatures, different context types)
    Module.registerHooks({
      // biome-ignore lint/suspicious/noExplicitAny: Type cast needed for hook compatibility
      resolve: resolveSync as any,
      // biome-ignore lint/suspicious/noExplicitAny: Type cast needed for hook compatibility
      load: loadSync as any,
    });
    return true;
  }
  return false;
}
