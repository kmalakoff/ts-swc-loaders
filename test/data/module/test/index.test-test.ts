import assert from "assert";
import exit from "exit";

import App from "./lib/App.js";
import guess from "./lib/guess.js";
import string from "./lib/string.cjs";

assert.ok(App, "App not loaded");
assert.equal(string, "string", "String not equal to string");
assert.equal(guess, "guess", "guess not equal to guess");

console.log("Success!");

exit(0); // ensure stdout is drained
