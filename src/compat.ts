/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

import Module from 'module';
import os from 'os';

// Node 20.19+ / 22.12+: require() can load ESM.
export const hasRequireModule = !!process.features.require_module;

const [nodeMajor, nodeMinor, nodePatch] = process.versions.node.split('.').map(Number);
// Node's own registerHooks cannot serve require(esm) of a builtin until 22.22.3, and corrupts the
// async chain when both are registered. Reproduced with no-op hooks on stock Node.
const registerHooksUnreliable = nodeMajor === 22 && ((nodeMinor >= 15 && nodeMinor <= 21) || (nodeMinor === 22 && nodePatch < 3));
export const hasReliableRegisterHooks = typeof (Module as { registerHooks?: unknown }).registerHooks === 'function' && !registerHooksUnreliable;

export function homedir(): string {
  return typeof os.homedir === 'function' ? os.homedir() : require('homedir-polyfill')();
}

/**
 * String.prototype.startsWith wrapper for Node.js 0.8+
 * - Uses native startsWith on Node 4.0+ / ES2015+
 * - Falls back to indexOf on Node 0.8-3.x
 */
const hasStartsWith = typeof String.prototype.startsWith === 'function';
export function stringStartsWith(str: string, search: string, position?: number): boolean {
  if (hasStartsWith) return str.startsWith(search, position);
  position = position || 0;
  return str.indexOf(search, position) === position;
}

/**
 * String.prototype.endsWith wrapper for Node.js 0.8+
 * - Uses native endsWith on Node 4.0+ / ES2015+
 * - Falls back to indexOf on Node 0.8-3.x
 */
const hasEndsWith = typeof String.prototype.endsWith === 'function';
export function stringEndsWith(str: string, search: string, position?: number): boolean {
  if (hasEndsWith) return str.endsWith(search, position);
  const len = position === undefined ? str.length : position;
  return len >= search.length && str.lastIndexOf(search) === len - search.length;
}
