const { execFile } = require('child_process');

describe('capabilities side effects', () => {
  it('does not add a CommonJS TypeScript hook', (done) => {
    const script = "var Module = require('module'); var before = Module._extensions['.ts']; require('ts-swc-loaders/capabilities'); if (Module._extensions['.ts'] !== before) process.exit(1);";
    execFile(process.execPath, ['-e', script], (err) => {
      if (err) return done(err);
      done();
    });
  });
});
