import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export default function toPath(x, context) {
  if (x.startsWith('file://')) return fileURLToPath(x);
  if (path.isAbsolute(x)) return x;
  if (x[0] === '.') {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    const parentPath = context && context.parentURL ? path.dirname(toPath(context.parentURL)) : process.cwd();
    return path.resolve(parentPath, x);
  }
  return x;
}
