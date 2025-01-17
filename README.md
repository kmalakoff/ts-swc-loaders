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
