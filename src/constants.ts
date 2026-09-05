import path from 'path';
import { constants as transformConstants } from 'ts-swc-transform';

import { homedir } from './compat.ts';

export const DEFAULT_CACHE_PATH: string = path.join(homedir(), '.ts-swc');
export const moduleRegEx = /^[^./]|^\.[^./]|^\.\.[^/]/;
export const typeFileRegEx = /\.d\.[cm]?ts$/;
// The TypeScript extensions among ts-swc-transform's full hook list (which also covers .js/.mjs/.cjs/.jsx).
export const typeScriptExtensions: string[] = transformConstants.extensions.filter((ext) => ext.indexOf('ts') >= 0);
