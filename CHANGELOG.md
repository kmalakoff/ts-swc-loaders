# Changelog

All notable changes to ts-swc-loaders are documented here.

## [2.8.2] - 2026-09-06

### Changed

- On Node 20.19 through 22.22.2, the loader no longer installs a CommonJS `require()` hook for
  TypeScript. Tools such as mocha that try `require()` before `import()` now load `.ts` files as ES
  modules on those versions, so a package's `import` condition is exercised there instead of its
  `require` condition. `require()` of a `.ts` file directly from CommonJS is not supported on those
  Node versions.
