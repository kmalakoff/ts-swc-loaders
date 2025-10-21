import homedir from 'homedir-polyfill';
import path from 'path';

export const DEFAULT_CACHE_PATH: string = path.join(homedir(), '.ts-swc');
export const moduleRegEx = /^[^./]|^\.[^./]|^\.\.[^/]/;
export const typeFileRegEx = /^[^.]+\.d\.[cm]?ts$/;
