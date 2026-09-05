## ts-swc-loaders

Typescript loaders for swc.

```
// universal
$ ts-swc mocha 'test/**/*.test.*'

// commonjs
$ mocha --require ts-swc-loaders 'test/**/*.test.*'

// module
$ cross-env NODE_OPTIONS='--loader ts-swc-loaders' mocha 'test/**/*.test.*'
```

### Node support for `require()` of TypeScript

`import()`/`--loader` transpilation works on every supported Node, through `module.register()`.
`require()` of a `.ts` file additionally needs Node's own `require(esm)` support, so coverage
depends on the version: below Node 20.19/22.12 there is none, and only `import()` is covered;
20.19-22.14, plus Node's own unreliable `module.registerHooks()` window (22.15-22.21), get it from
a CommonJS `require()` hook this package installs; 22.22.3 and later, and 24/26, get it from
`module.registerHooks()`, registered alongside the async chain rather than in place of it.
