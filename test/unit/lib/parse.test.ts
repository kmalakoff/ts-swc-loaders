import assert from 'assert';
import fs from 'fs';
import Module from 'module';
import path from 'path';
import { parse } from 'ts-swc-loaders';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
// Mirrors parse's own gate: module.register (18.19 / 20.6) is what selects the --import bootstrap.
const hasRegister = typeof (Module as { register?: unknown }).register === 'function';
// Mirrors parse's own registerHooksUnreliable: on this Node, the bootstrap skips the sync-hooks
// attempt entirely (Node bug, 22.15-22.21), so it never mentions registerSyncHooks/registerHooks.js.
const [nodeMajor, nodeMinor, nodePatch] = process.versions.node.split('.').map(Number);
const registerHooksUnreliable = nodeMajor === 22 && ((nodeMinor >= 15 && nodeMinor <= 21) || (nodeMinor === 22 && nodePatch < 3));
// Mirrors parse's own gate: require(esm) exists but no trustworthy sync hooks, so the pirates
// CommonJS register is what covers require() of TypeScript on this Node.
const needsCJSRegister = !!process.features.require_module && !(typeof (Module as { registerHooks?: unknown }).registerHooks === 'function' && !registerHooksUnreliable);

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
    if (!hasRegister) {
      describe('without module.register', () => {
        it('sets NODE_OPTIONS environment variable', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          if (!result.options.env) throw new Error('no env');
          if (!result.options.env.NODE_OPTIONS) throw new Error('no NODE_OPTIONS');
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('preserves existing NODE_OPTIONS', () => {
          const result = parse('module', 'node', ['test.ts'], {
            env: { NODE_OPTIONS: '--max-old-space-size=4096' },
          });
          if (!result.options.env || !result.options.env.NODE_OPTIONS) throw new Error('no NODE_OPTIONS');
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--max-old-space-size=4096') >= 0);
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('works when NODE_OPTIONS is undefined', () => {
          const result = parse('module', 'node', ['test.ts'], { env: {} });
          if (!result.options.env || !result.options.env.NODE_OPTIONS) throw new Error('no NODE_OPTIONS');
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('--loader') >= 0);
        });

        it('uses esm loader path in NODE_OPTIONS', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          if (!result.options.env || !result.options.env.NODE_OPTIONS) throw new Error('no NODE_OPTIONS');
          assert.ok(result.options.env.NODE_OPTIONS.indexOf('index-esm.js') >= 0);
        });
      });
    } else {
      describe('with module.register', () => {
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
          // The pirates CJS register leads only where require() needs it; otherwise --import leads.
          assert.equal(result.args[0], needsCJSRegister ? '--require' : '--import');
          assert.ok(result.args.indexOf('--import') >= 0);
          assert.ok(result.args.indexOf('test.ts') >= 0);
        });

        it('attempts the sync hooks exactly where this Node can be trusted with them', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importArg = result.args[result.args.indexOf('--import') + 1];
          const attempts = importArg.indexOf('registerSyncHooks') >= 0 && importArg.indexOf('registerHooks.js') >= 0;
          assert.equal(attempts, !registerHooksUnreliable, `sync-hooks attempt should be ${!registerHooksUnreliable} on ${process.versions.node}`);
        });

        it('always registers the async chain, which is what injects the json import attribute', () => {
          const result = parse('module', 'node', ['test.ts'], {});
          const importArg = result.args[result.args.indexOf('--import') + 1];
          assert.ok(importArg.indexOf('register("file://') >= 0, 'bootstrap must always call module.register()');
        });

        it('every file:// URL in the bootstrap resolves to a file that exists on disk', () => {
          const result = parse('module', process.execPath, [], {});
          const importIndex = result.args.indexOf('--import');
          const importArg = result.args[importIndex + 1] as string;
          const urls = importArg.match(/file:\/\/[^"]+/g) || [];
          assert.ok(urls.length > 0, 'expected at least one file:// URL in the bootstrap');
          urls.forEach((fileURL) => {
            const filePath = url.fileURLToPath(fileURL);
            assert.ok(fs.existsSync(filePath), `bootstrap references a missing file: ${fileURL}`);
          });
        });
      });
    }
  });

  describe('node executable detection', () => {
    // Windows spells the executable node.exe / node.cmd and matches filenames case-insensitively,
    // so every spelling means the command already IS node and must not be repeated as a script.
    const spellings = ['node', 'node.exe', 'node.cmd', 'NODE.EXE', path.join('/usr/local/bin', 'node'), process.execPath];

    spellings.forEach((command) => {
      it(`does not pass ${command} to node as a script argument`, () => {
        const result = parse('module', command, ['test.ts'], {});
        assert.equal(result.command, process.execPath);
        assert.equal(result.args.indexOf(command), -1);
        assert.equal(result.args[result.args.length - 1], 'test.ts');
      });
    });

    it('passes a non-node command to node as a script argument', () => {
      const bin = path.join(__dirname, 'mocha.js');
      const result = parse('module', bin, ['test.ts'], {});
      assert.equal(result.command, process.execPath);
      assert.ok(result.args.indexOf(bin) >= 0);
      assert.ok(result.args.indexOf(bin) < result.args.indexOf('test.ts'));
    });
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
      if (!result.options.env) throw new Error('no env');
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
