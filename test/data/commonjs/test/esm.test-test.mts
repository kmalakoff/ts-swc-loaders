import value from "./lib/esm-value.mjs";

if (value !== 43) throw new Error(`.mts not loaded as ESM: ${value}`);
console.log("Success!");
