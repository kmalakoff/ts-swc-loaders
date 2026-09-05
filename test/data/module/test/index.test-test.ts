import assert from "assert";
import exit from "exit-compat";

import App from "./lib/App.js";
import guess from "./lib/guess.js";
import data from "./lib/data.json";
import string from "./lib/string.cjs";
import generic from "./lib/generic.js";

assert.ok(App, "App not loaded");
assert.equal(string, "string", "String not equal to string");
assert.equal(guess, "guess", "guess not equal to guess");
assert.equal(generic, 42, "Generic TypeScript not transpiled correctly");
// The async loader injects the json import attribute; without it Node throws ERR_IMPORT_ATTRIBUTE_MISSING.
assert.equal(data.value, 42, "JSON not imported without an explicit import attribute");

console.log("Success!");

exit(0); // ensure stdout is drained
