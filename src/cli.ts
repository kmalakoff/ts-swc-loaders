import type { SpawnOptions } from 'cross-spawn-cb';
import exit from 'exit';
import fs from 'fs';
import getopts from 'getopts-compat';
import path from 'path';
import url from 'url';
import cache from './cache.ts';
import run from './lib/spawn.ts';

const ERROR_CODE = 17;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

function getVersion(): string {
  const pkgPath = path.join(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.version;
}

function showHelp(name: string): void {
  const version = getVersion();
  console.log(`${name} v${version}`);
  console.log('');
  console.log(`Usage: ${name} [options] <command> [args...]

Options:
  -c, --clear    Clear the cache
  -h, --help     Show this help message
  -v, --version  Show version number

Examples:
  ${name} node script.ts
  ${name} mocha test/*.test.ts
  ${name} --clear`);
}

export default function cli(argv: string[], name = 'ts-swc'): undefined {
  const options = getopts(argv, {
    alias: { clear: 'c', help: 'h', version: 'v' },
    boolean: ['clear', 'help', 'version'],
    stopEarly: true,
  });

  if (options.version) {
    console.log(getVersion());
    exit(0);
    return;
  }

  if (options.help) {
    showHelp(name);
    exit(0);
    return;
  }

  if (options.clear) cache.clear();

  const args = options._;
  if (!args.length) {
    console.log('Missing command. Example usage: ts-swc command arg1, arg2, etc');
    exit(options.clear ? 0 : ERROR_CODE);
    return;
  }

  options.stdio = 'inherit'; // pass through stdio
  run(args[0], args.slice(1), options as SpawnOptions, (err) => {
    if (err && err.status === 3221226505) err = null; // windows can give spurious errors on node 18
    exit(err ? ERROR_CODE : 0);
  });
}
