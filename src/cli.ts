import exit from 'exit';
import getopts from 'getopts-compat';
import cache from './cache';
import spawn from './lib/spawn';

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

  spawn(args[0], args.slice(1), options, (err) => {
    exit(err ? 18 : 0);
  });
}
