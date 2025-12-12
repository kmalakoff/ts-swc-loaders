import assert from "assert";
import exit from "exit-compat";

import App from "./lib/App.js";
import guess from "./lib/guess.js";
import string from "./lib/string.cjs";
import generic from "./lib/generic.js";

assert.ok(App, "App not loaded");
assert.equal(string, "string", "String not equal to string");
assert.equal(guess, "guess", "guess not equal to guess");
assert.equal(generic, 42, "Generic TypeScript not transpiled correctly");

console.log("Success!");

exit(0); // ensure stdout is drained
