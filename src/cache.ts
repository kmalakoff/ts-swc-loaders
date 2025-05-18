import { DEFAULT_CACHE_PATH } from './constants.js';
import Cache from './lib/Cache.js';
export default new Cache({ cachePath: process.env.TS_SWC_CACHE_PATH || DEFAULT_CACHE_PATH });
