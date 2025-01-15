import exit from 'exit';
import getopts from 'getopts-compat';
import clean from './lib/clean';
import spawn from './lib/spawn';

export default function cli(argv) {
  const options = getopts(argv, {
    alias: { clean: 'c' },
    boolean: ['clean'],
    stopEarly: true,
  });
  if (options.clean) clean();

  const args = options._;
  if (!args.length) {
    console.log('Missing command. Example usage: ts-swc command arg1, arg2, etc');
    return exit(options.clean ? 0 : 17);
  }

  spawn(args[0], args.slice(1), options, (err) => {
    if (err) console.log(JSON.stringify({ err }));
    exit(err ? 18 : 0);
  });
}
