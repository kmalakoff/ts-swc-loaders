import path from 'path';
import homedir from 'homedir-polyfill';

export const DEFAULT_CACHE_PATH = path.join(homedir(), '.ts-swc');
export const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
export const typeFileRegEx = /^[^.]+\.d\.[cm]?ts$/;
