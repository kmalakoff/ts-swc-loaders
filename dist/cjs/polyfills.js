"use strict";
require("core-js/actual/string/ends-with");
require("core-js/actual/string/starts-with");
require("core-js/actual/object/assign");

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}