import exit from 'exit';
import getopts from 'getopts-compat';
import cache from './cache';
import spawn from './lib/spawn';

const DEBUG = typeof process.env.TS_SWC_DEBUG !== 'undefined';

export default function cli(argv) {
  const options = getopts(argv, {
    alias: { clear: 'c' },
    boolean: ['clear'],
    stopEarly: true,
  });
  if (options.clear) cache.clear();

  const args = options._;
  if (!args.length) {
    console.log('Missing command. Example usage: ts-swc command arg1, arg2, etc');
    return exit(options.clear ? 0 : 17);
  }

  const spawnOptions = DEBUG ? { ...options, encoding: 'utf8' } : { ...options, stdio: 'inherit' };
  spawn(args[0], args.slice(1), spawnOptions, (err, res) => {
    if (DEBUG && err) console.log(JSON.stringify({ err, res }));
    exit(err ? 18 : 0);
  });
}
