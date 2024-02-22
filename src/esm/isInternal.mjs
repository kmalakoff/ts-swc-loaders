const DIST = new URL('../..', import.meta.url).href;
export default function isInternal(test) {
  if (test.startsWith(DIST)) return true;
  if (test.indexOf('/node_modules') >= 0) return true;
  return false;
}
