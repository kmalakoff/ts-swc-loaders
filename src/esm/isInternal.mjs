import path from 'path';

const DIST = new URL('../..', import.meta.url).href;
const INTERNAL_PATHS = [DIST, path.resolve(DIST, '..', 'node_modules')];
export default function isInternal(test) {
  return INTERNAL_PATHS.some((x) => test.startsWith(x));
}
