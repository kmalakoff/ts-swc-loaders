// Mirrors mocha's import() of a .cjs test file inside the include whose require() reaches ESM.
import('../test/lib/require-esm.cjs').then((mod) => {
  if (mod.default !== 42) throw new Error('bad export: ' + mod.default);
  console.log('IMPORT_CJS_OK');
});
