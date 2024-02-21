import path from 'path';

const DIST = new URL('..', '..', import.meta.url).href;
const INTERNAL_PATHS = [DIST, path.resolve(DIST, '..', 'node_modules')];
export default function isInternal(x) {
  return INTERNAL_PATHS.some((y) => x.startsWith(y));
}
