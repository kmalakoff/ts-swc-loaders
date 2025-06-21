import type { SpawnOptions } from 'cross-spawn-cb';
import exit from 'exit';
import getopts from 'getopts-compat';
import cache from './cache.js';
import run from './lib/spawn.js';

const ERROR_CODE = 17;

export default function cli(argv: string[]): undefined {
  const options = getopts(argv, {
    alias: { clear: 'c' },
    boolean: ['clear'],
    stopEarly: true,
  });
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
