import type { SpawnCallback, SpawnOptions } from 'cross-spawn-cb';
import exit from 'exit-compat';
import fs from 'fs';
import getopts from 'getopts-compat';
import path from 'path';
import url from 'url';

const ERROR_CODE = 17;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

function getVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version;
  } catch (_err) {
    return 'unknown';
  }
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

export default function cli(argv: string[], name = 'ts-swc'): void {
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

  const args = options._;

  function afterClear(): void {
    if (!args.length) {
      console.log('Missing command. Example usage: ts-swc command arg1, arg2, etc');
      exit(options.clear ? 0 : ERROR_CODE);
      return;
    }

    options.stdio = 'inherit'; // pass through stdio
    // deferred: lib/spawn.ts pulls cross-spawn-cb/resolve-bin-sync. require() cannot load this ESM
    // sibling below Node 20.19 (require(esm)), so the ESM half needs a real dynamic import; the
    // CJS half's sibling is genuine CommonJS, so a plain synchronous require avoids depending on
    // Promise, which isn't global before Node 0.12.
    loadSibling('./lib/spawn.js', (err, runModule) => {
      if (err || !runModule) {
        console.error(err ? err.message : 'Failed to load spawn module');
        exit(ERROR_CODE);
        return;
      }
      const run = runModule.default || runModule;
      run(args[0], args.slice(1), options as SpawnOptions, (err: Parameters<SpawnCallback>[0]) => {
        if (err && err.status === 3221226505) err = undefined; // windows can give spurious errors on node 18
        exit(err ? ERROR_CODE : 0);
      });
    });
  }

  if (options.clear) {
    // deferred: cache.ts pulls the on-disk cache (fs-remove-compat, mkdirp-classic, short-hash).
    // require() cannot load this ESM sibling below Node 20.19 (require(esm)), so the ESM half needs
    // a real dynamic import; the CJS half's sibling is genuine CommonJS, so a plain synchronous
    // require avoids depending on Promise, which isn't global before Node 0.12.
    loadSibling('./cache.js', (err, cacheModule) => {
      if (err || !cacheModule) {
        console.error(err ? err.message : 'Failed to load cache module');
        exit(ERROR_CODE);
        return;
      }
      const cache = cacheModule.default || cacheModule;
      cache.clear();
      afterClear();
    });
  } else {
    afterClear();
  }
}

// biome-ignore lint/suspicious/noExplicitAny: module shape varies per specifier (cache vs spawn)
function loadSibling(specifier: string, callback: (err: Error | null, mod?: any) => void): void {
  if (typeof require === 'undefined') {
    import(specifier).then((mod) => callback(null, mod)).catch((err) => callback(err instanceof Error ? err : new Error(String(err))));
  } else {
    try {
      callback(null, require(specifier));
    } catch (err) {
      callback(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
