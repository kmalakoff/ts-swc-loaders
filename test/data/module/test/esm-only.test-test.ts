// A TypeScript-only construct (the type annotation) is required so this cannot silently parse as
// plain JavaScript: only a transpiling hook can load it, whether by require() or by import().
const isESM: boolean = typeof require === "undefined";

// mocha's requireModule tries require() before import() wherever require_module is true. A throw
// here would make mocha silently retry via import(), masking a CommonJS require() hook, so this
// reports the outcome instead of asserting it.
console.log(isESM ? "ESM_ONLY_OK" : "ESM_ONLY_FAIL: loaded as CommonJS, require is defined");
