/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

import os from 'os';

/**
 * String.prototype.startsWith wrapper for Node.js 0.8+
 * - Uses native startsWith on Node 4.0+ / ES2015+
 * - Falls back to indexOf on Node 0.8-3.x
 */
const hasStartsWith = typeof String.prototype.startsWith === 'function';

export function stringStartsWith(str: string, search: string, position?: number): boolean {
  if (hasStartsWith) {
    return str.startsWith(search, position);
  }
  position = position || 0;
  return str.indexOf(search, position) === position;
}

/**
 * String.prototype.endsWith wrapper for Node.js 0.8+
 * - Uses native endsWith on Node 4.0+ / ES2015+
 * - Falls back to indexOf on Node 0.8-3.x
 */
const hasEndsWith = typeof String.prototype.endsWith === 'function';

export function stringEndsWith(str: string, search: string, length?: number): boolean {
  if (hasEndsWith) {
    return str.endsWith(search, length);
  }
  length = length === undefined ? str.length : length;
  const pos = length - search.length;
  return pos >= 0 && str.indexOf(search, pos) === pos;
}

/**
 * os.homedir wrapper for Node.js 0.8+
 * - Uses native os.homedir on Node 4.0+
 * - Falls back to homedir-polyfill on Node 0.8-3.x
 */
const hasHomedir = typeof os.homedir === 'function';
export function homedir(): string {
  if (hasHomedir) return os.homedir();
  // Fallback to polyfill for Node 0.8-3.x
  const home = require('homedir-polyfill');
  return home();
}
