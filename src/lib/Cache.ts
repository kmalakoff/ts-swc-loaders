import crypto from 'crypto';
import fs from 'fs';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import rimraf2 from 'rimraf2';
import shortHash from 'short-hash';

function unlinkSafe(filePath: string): undefined {
  try {
    fs.unlinkSync(filePath);
  } catch (_err) {
    // skip
  }
}

function timeMS(): number {
  return Date.now();
}
const MS_TO_DAYS = 1000 * 60 * 60 * 24;

import type { CacheOptions, ClearOptions } from '../types.ts';

export default class Cache<T> {
  private cachePath: string;
  private maxAge: number;
  private cwdHash: string;

  constructor(options: CacheOptions = {}) {
    this.cwdHash = crypto.createHash('md5').update(process.cwd()).digest('hex');
    this.cachePath = options.cachePath;
    this.maxAge = options.maxAge || 1 * MS_TO_DAYS;
  }

  clear(options: ClearOptions = {}): undefined {
    rimraf2.sync(this.cachePath, { disableGlob: true });
    if (!options.silent) console.log(`Cleared ${this.cachePath}`);
  }

  hash(contents: string): string {
    return crypto.createHash('sha512').update(contents).digest('hex');
  }

  key(filePath: string, options: object): string {
    const dirHash = shortHash(path.dirname(filePath));
    const optionsHash = shortHash(JSON.stringify(options));
    const basename = path.basename(filePath);
    return path.join(this.cachePath, this.cwdHash, `${optionsHash}${dirHash}`, `${basename}.json`);
  }

  get(key: string, hash: string): T {
    try {
      const record = JSON.parse(fs.readFileSync(key, 'utf8'));
      const age = timeMS() - record.time;
      if (age > this.maxAge || record.hash !== hash) {
        unlinkSafe(key);
        return null;
      }
      return record.data;
    } catch (_err) {
      return null;
    }
  }

  set(key: string, data: T, hash: string): T {
    const record = {
      data,
      hash,
      time: timeMS(),
    };
    mkdirp.sync(path.dirname(key));
    fs.writeFileSync(key, JSON.stringify(record), 'utf8');
    return data;
  }
}
