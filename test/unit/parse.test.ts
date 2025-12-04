import assert from 'assert';
import path from 'path';
import { parse } from 'ts-swc-loaders';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];

describe('parse', () => {
  describe('commonjs', () => {
    it('uses --require flag for commonjs', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {});
      assert.ok(result.args.indexOf('--require') >= 0);
    });

    it('includes the cjs loader path', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {});
      const requireIndex = result.args.indexOf('--require');
      const loaderPath = result.args[requireIndex + 1];
      assert.ok(loaderPath.indexOf('index-cjs.js') >= 0);
    });

    it('preserves original args after loader args', () => {
      const result = parse('commonjs', 'node', ['test.ts', '--flag'], {});
      assert.ok(result.args.indexOf('test.ts') >= 0);
      assert.ok(result.args.indexOf('--flag') >= 0);
    });
  });

  describe('module (ESM)', () => {
    if (major <= 16) {
      describe('Node <=16 path', () => {
        it('sets NODE_OPTIONS environment variable', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          assert.ok(result.options.env);
          assert.ok(result.options.env.NODE_OPTIONS);
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('preserves existing NODE_OPTIONS', () => {
          const result = parse('module', 'node', ['test.ts'], {
            env: { NODE_OPTIONS: '--max-old-space-size=4096' },
          });
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--max-old-space-size=4096') >= 0);
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('works when NODE_OPTIONS is undefined', () => {
          const result = parse('module', 'node', ['test.ts'], { env: {} });
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('uses esm loader path in NODE_OPTIONS', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('index-esm.js') >= 0);
        });
      });
    } else {
      describe('Node >16 path', () => {
        it('uses --import flag', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          assert.ok(result.args.indexOf('--import') >= 0);
        });

        it('uses data URL format for loader registration', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importIndex = result.args.indexOf('--import');
          const importArg = result.args[importIndex + 1];
          assert.ok(importArg.indexOf('data:text/javascript') === 0);
        });

        it('includes register call in data URL', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importIndex = result.args.indexOf('--import');
          const importArg = result.args[importIndex + 1];
          assert.ok(importArg.indexOf('register') >= 0);
        });

        it('uses process.execPath as command', () => {
          const result = parse('module', process.execPath, ['test.ts'], {});
          assert.equal(result.command, process.execPath);
        });

        it('prepends loader args when command is node executable', () => {
          const result = parse('module', process.execPath, ['test.ts'], {});
          assert.ok(result.args[0] === '--import');
          assert.ok(result.args.indexOf('test.ts') >= 0);
        });

        it('includes registerSyncHooks in data URL for Node 22.15+ support', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importIndex = result.args.indexOf('--import');
          const importArg = result.args[importIndex + 1];
          assert.ok(importArg.indexOf('registerSyncHooks') >= 0, 'data URL should include registerSyncHooks');
        });

        it('includes registerHooks URL in data URL', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importIndex = result.args.indexOf('--import');
          const importArg = result.args[importIndex + 1];
          assert.ok(importArg.indexOf('registerHooks.js') >= 0, 'data URL should reference registerHooks.js');
        });
      });
    }
  });

  describe('options passthrough', () => {
    it('preserves cwd option', () => {
      const result = parse('commonjs', 'node', ['test.ts'], { cwd: '/some/path' });
      assert.equal(result.options.cwd, '/some/path');
    });

    it('preserves custom env variables', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {
        env: { CUSTOM_VAR: 'value' },
      });
      assert.equal(result.options.env.CUSTOM_VAR, 'value');
    });
  });

  describe('return structure', () => {
    it('returns command as string', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {});
      assert.equal(typeof result.command, 'string');
    });

    it('returns args as array', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {});
      assert.ok(Array.isArray(result.args));
    });

    it('returns options as object', () => {
      const result = parse('commonjs', 'node', ['test.ts'], {});
      assert.equal(typeof result.options, 'object');
    });
  });
});
