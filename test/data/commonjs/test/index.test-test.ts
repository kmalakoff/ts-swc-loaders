require("core-js/actual/object/assign"); // React uses Object.assign
require("core-js/actual/symbol/for"); // React uses Symbol.for("react.transitional.element")
require("core-js/actual/map"); // React uses Map

const exit = require("exit");
const assert = require("assert");

const App = require("./lib/App.tsx");
const string = require("./lib/string.cjs");
const guess = require("./lib/guess");

assert.ok(App, "App not loaded");
assert.equal(string, "string", "String not equal to string");
assert.equal(guess, "guess", "guess not equal to guess");

console.log("Success!");

exit(0); // ensure stdout is drained
