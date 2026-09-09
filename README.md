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

`import()`/`--loader` transpilation works on every supported Node: through `module.registerHooks()`
on 22.22.3 and later and on 24/26, and through `module.register()` (deprecated by Node 26) below that.
`require()` of a `.ts` file additionally needs Node's own `require(esm)` support and trustworthy
sync hooks, so it is served only on 22.22.3 and later and on 24/26, where `module.registerHooks()`
covers both `import()` and `require()`. Below Node 20.19/22.12 there is no `require(esm)` at all,
and on 20.19 through 22.22.2 only `import()` is covered. On Node with `require(esm)`, a CommonJS
file reached through `import()` is left to Node's own CJS loader so its `require()` can load ESM.

In module mode, consumers can check whether the bootstrap supports loading TypeScript through
`require()` without installing hooks:

```js
const { supportsRequireTypeScript } = require('ts-swc-loaders/capabilities');
```

Legacy CommonJS mode supports TypeScript on every supported Node version when the main entry is
loaded with `--require ts-swc-loaders`.
