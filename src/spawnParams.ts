import path from 'path';
import url from 'url';
import packageRoot from './lib/packageRoot.js';

const major = +process.versions.node.split('.')[0];
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = packageRoot(__dirname);

const loaderCJS = path.join(root, 'dist', 'cjs', 'index.cjs.js');
const loaderEMS = !url.pathToFileURL || url.pathToFileURL(path.join(root, 'dist', 'esm', 'index.esm.mjs'));
// const importArgs = `data:text/javascript,import { register } from "node:module"; register("ts-swc-loaders", "${loaderEMS}");`;

import type { SpawnParamsOptions, SpawnParamsResult } from './types.js';
export default function spawnParams(type: string, options: SpawnParamsOptions | undefined): SpawnParamsResult {
  if (type === 'commonjs') return { args: ['--require', loaderCJS], options };
  // https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options
  // v20.8.0
  // if (major >= 18) return { args: ['--no-warnings=ExperimentalWarning', '--import', importArgs], options };

  // args
  const args = major > 4 ? ['--no-warnings=ExperimentalWarning'] : [];
  // if (major <= 16) args.push('--experimental-modules');

  // options
  const env = options.env || process.env;
  options = options ? { ...options } : { env };
  options.env = { ...env };
  options.env.NODE_OPTIONS = `--loader ${loaderEMS}${env.NODE_OPTIONS ? ` ${options.env.NODE_OPTIONS}` : ''}`;
  return { args, options };
}
