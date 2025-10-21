import { DEFAULT_CACHE_PATH } from './constants.ts';
import Cache from './lib/Cache.ts';

import type { Compiled } from './types.ts';
export default new Cache<Compiled>({
  cachePath: process.env.TS_SWC_CACHE_PATH || DEFAULT_CACHE_PATH,
});
