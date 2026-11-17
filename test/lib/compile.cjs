// Compiles every file in a folder through the cache and prints the code as JSON: node compile.cjs <cachePath> <projectDir> <file>...
var Cache = require('ts-swc-loaders').Cache;
var transformSync = require('ts-swc-transform').transformSync;
var loadConfigSync = require('read-tsconfig-sync');
var fs = require('fs');

var cachePath = process.argv[2];
var tsconfig = loadConfigSync(process.argv[3]);
var cache = new Cache({ cachePath: cachePath });
var files = process.argv.slice(4);

var codes = files.map(function (file) {
  var contents = fs.readFileSync(file, 'utf8');
  var key = cache.key(file, tsconfig);
  var hash = cache.hash(contents);
  return (cache.get(key, hash) || cache.set(key, transformSync(contents, file, tsconfig), hash)).code;
});
process.stdout.write(JSON.stringify(codes));
