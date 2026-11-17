import crypto from 'crypto';
import fs from 'fs';
import { safeRmSync } from 'fs-remove-compat';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import tempSuffix from 'temp-suffix';

import { COMPILERS, DEFAULT_CACHE_PATH, userId } from '../constants.ts';
import type { CacheOptions, ClearOptions } from '../types.ts';

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export default class Cache<T> {
  private cachePath: string;
  // undefined until checked; false when the folder is missing, not a directory, or owned by another user
  private usable: boolean | undefined;

  // maxAge is accepted for compatibility and ignored: the operating system trims the temp folder.
  constructor(options: CacheOptions = {}) {
    this.cachePath = options.cachePath || process.env.TS_SWC_CACHE_PATH || DEFAULT_CACHE_PATH;
  }

  clear(options: ClearOptions = {}): void {
    safeRmSync(this.cachePath);
    this.usable = undefined;
    if (!options.silent) console.log(`Cleared ${this.cachePath}`);
  }

  hash(contents: string): string {
    return crypto.createHash('sha512').update(contents).digest('hex');
  }

  key(filePath: string, options: object): string {
    return sha256(JSON.stringify([COMPILERS, filePath, options]));
  }

  get(key: string, hash: string): T | null {
    if (!this.ready()) return null;
    try {
      return JSON.parse(fs.readFileSync(this.file(key, hash), 'utf8'));
    } catch (_err) {
      return null;
    }
  }

  set(key: string, data: T, hash: string): T {
    if (!this.ready()) return data;
    const file = this.file(key, hash);
    const temp = tempSuffix(file);
    try {
      fs.writeFileSync(temp, JSON.stringify(data), 'utf8');
      fs.renameSync(temp, file);
    } catch (err) {
      try {
        fs.unlinkSync(temp);
      } catch (_err) {
        // no temporary file to remove
      }
      // the operating system removed the folder mid-run: check and recreate it on the next call
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') this.usable = undefined;
    }
    return data;
  }

  private file(key: string, hash: string): string {
    return path.join(this.cachePath, `${sha256(key + hash)}.json`);
  }

  // Checked once per process: the folder is created 0700 and must be our own directory.
  private ready(): boolean {
    if (this.usable !== undefined) return this.usable;
    try {
      mkdirp.sync(this.cachePath, 0o700);
      const stats = fs.lstatSync(this.cachePath);
      this.usable = stats.isDirectory() && (userId === undefined || stats.uid === userId);
    } catch (_err) {
      this.usable = false;
    }
    return this.usable;
  }
}
