import path from 'path';
const DIST = new URL('../..', import.meta.url).href;
const INTERNAL_PATHS = [
    DIST,
    path.resolve(DIST, '..', 'node_modules')
];
export default function isInternal(test) {
    if (test.startsWith(INTERNAL_PATHS[0])) return true;
    if (test.startsWith(INTERNAL_PATHS[1])) return true;
    return false;
}
