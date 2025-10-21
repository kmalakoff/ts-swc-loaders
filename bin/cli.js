#!/usr/bin/env node

if (typeof require === 'undefined')
  // biome-ignore lint/security/noGlobalEval: dual esm and cjs
  eval("import('../dist/esm/cli.js').then((cli) => cli.default(process.argv.slice(2), 'ts-swc')).catch((err) => { console.log(err); process.exit(-1); });");
else require('../dist/cjs/cli.js')(process.argv.slice(2), 'ts-swc');
