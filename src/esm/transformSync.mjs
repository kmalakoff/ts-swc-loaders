import path from 'path';
import { fileURLToPath } from 'url';
import call from 'node-version-call';
import process from 'process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const major = +process.versions.node.split('.')[0];
const version = major >= 14 ? 'local' : 'lts';
const worker = path.resolve(__dirname, '..', 'workers', 'transformSync.cjs');

export default function transformSync(contents, filename, config) {
  return call(version, worker, contents, filename, config);
}
