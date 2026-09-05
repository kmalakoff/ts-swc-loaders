const { gen } = require('../test/lib/generic-fn.ts');
const xs = gen();
if (xs[0] !== 1) throw new Error('not transpiled: ' + JSON.stringify(xs));
console.log('REQUIRE_TS_OK');
