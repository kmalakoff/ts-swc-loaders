import path from 'path';

import { homedir } from './compat.ts';

export const DEFAULT_CACHE_PATH: string = path.join(homedir(), '.ts-swc');
export const moduleRegEx = /^[^./]|^\.[^./]|^\.\.[^/]/;
export const typeFileRegEx = /\.d\.[cm]?ts$/;
