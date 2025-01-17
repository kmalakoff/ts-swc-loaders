import exit from 'exit';
import getopts from 'getopts-compat';
import cache from './cache';
import run from './lib/spawn';

const ERROR_CODE = 17;

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
    return exit(options.clear ? 0 : ERROR_CODE);
  }

  const next = (err, _res) => {
    if (err && err.status === 3221226505) err = null; // windows can give spurious errors
    exit(err ? ERROR_CODE : 0);
  };

  // DEBUG MODE
  if (typeof process.env.DEBUG !== 'undefined') {
    options.encoding = 'utf8';
    return run(args[0], args.slice(1), options, (err, res) => {
      if (err) console.log(JSON.stringify({ err, res }));
      console.log((res || err || {}).stdout);
      next(err, res);
    });
  }

  options.stdio = 'inherit'; // pass through stdio
  return run(args[0], args.slice(1), options, next);
}
