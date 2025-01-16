import { DEFAULT_CACHE_PATH } from './constants';
import Cache from './lib/Cache';
export default new Cache({ cachePath: process.env.TS_SWC_CACHE_PATH || DEFAULT_CACHE_PATH });
