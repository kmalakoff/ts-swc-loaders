import assert from 'assert';
import spawn from 'cross-spawn-cb';
import fs from 'fs';
import { safeRmSync } from 'fs-remove-compat';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import loadConfigSync from 'read-tsconfig-sync';
import { Cache } from 'ts-swc-loaders';
import { transformSync } from 'ts-swc-transform';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'test', 'lib', 'compile.cjs');
const PROJECT_DIR = path.join(ROOT, 'test', 'data', 'commonjs');
const SCRATCH = path.join(ROOT, '.tmp', 'cache-integration');

const FILES = ['App.tsx', 'generic.ts'].map((name) => path.join(PROJECT_DIR, 'test', 'lib', name));
const PROCESSES = 3;

describe('Cache across processes and folders', () => {
  beforeEach(() => safeRmSync(SCRATCH));
  after(() => safeRmSync(SCRATCH));

  it('three processes on one cache path write one entry per file and all compile correctly', (done) => {
    const cachePath = path.join(SCRATCH, 'shared');
    const tsconfig = loadConfigSync(PROJECT_DIR) ?? undefined;
    const expected = FILES.map((file) => transformSync(fs.readFileSync(file, 'utf8'), file, tsconfig).code);

    const outputs: string[] = [];
    let pending = PROCESSES;
    let failed = false;
    for (let index = 0; index < PROCESSES; index++) {
      spawn(process.execPath, [SCRIPT, cachePath, PROJECT_DIR].concat(FILES), { encoding: 'utf8' }, (err, res) => {
        if (failed) return;
        if (err || !res) {
          failed = true;
          return done(err || new Error('no res'));
        }
        outputs.push(res.stdout as string);
        if (--pending > 0) return;
        try {
          for (let ii = 0; ii < outputs.length; ii++) assert.deepEqual(JSON.parse(outputs[ii]), expected);
          const names = fs.readdirSync(cachePath);
          assert.equal(names.length, FILES.length, names.join(', '));
          for (let ii = 0; ii < names.length; ii++) assert.ok(/\.json$/.test(names[ii]), names[ii]);
          done();
        } catch (error) {
          done(error as Error);
        }
      });
    }
  });

  it('the same file in two folders gets different, correct code with jsx react-jsxdev', () => {
    const source = 'export default function App() { return <div />; }\n';
    const cache = new Cache<{ code: string }>({ cachePath: path.join(SCRATCH, 'jsxdev-cache') });
    const compiled: string[] = [];

    ['a', 'b'].forEach((name) => {
      const dir = path.join(SCRATCH, name, 'src');
      mkdirp.sync(dir);
      const file = path.join(dir, 'm.tsx');
      fs.writeFileSync(file, source, 'utf8');
      const tsconfig = { path: path.join(SCRATCH, name, 'tsconfig.json'), config: { compilerOptions: { jsx: 'react-jsxdev' as const, target: 'es2019' as const, module: 'commonjs' as const } } };

      const key = cache.key(file, tsconfig);
      const hash = cache.hash(source);
      const code = (cache.get(key, hash) || cache.set(key, transformSync(source, file, tsconfig), hash)).code;
      assert.ok(code.indexOf(file) >= 0, 'code names its own file');
      assert.equal(code, transformSync(source, file, tsconfig).code);
      compiled.push(code);
    });

    assert.notEqual(compiled[0], compiled[1]);
    assert.equal(fs.readdirSync(path.join(SCRATCH, 'jsxdev-cache')).length, 2);
  });
});
