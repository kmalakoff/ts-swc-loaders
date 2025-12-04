require("core-js/actual/object/assign"); // React uses Object.assign
require("core-js/actual/symbol/for"); // React uses Symbol.for("react.transitional.element")
require("core-js/actual/map"); // React uses Map

const exit = require("exit");
const assert = require("assert");

const App = require("./lib/App.tsx");
const string = require("./lib/string.cjs");
const guess = require("./lib/guess");
const generic = require("./lib/generic.ts");

assert.ok(App, "App not loaded");
assert.equal(string, "string", "String not equal to string");
assert.equal(guess, "guess", "guess not equal to guess");
assert.equal(generic.default, 42, "Generic TypeScript not transpiled correctly");

console.log("Success!");

exit(0); // ensure stdout is drained
