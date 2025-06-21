import { DEFAULT_CACHE_PATH } from './constants.js';
import Cache from './lib/Cache.js';

import type { Compiled } from './types.js';
export default new Cache<Compiled>({ cachePath: process.env.TS_SWC_CACHE_PATH || DEFAULT_CACHE_PATH });
