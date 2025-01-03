import fs from 'fs';
import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp-classic';
import osShim from 'os-shim';
import shortHash from 'short-hash';

const tmpdir = os.tmpdir || osShim.tmpdir;

function unlinkSafe(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (_err) {
    // skip
  }
}
function timeMS() {
  return new Date().valueOf();
}
const MS_TO_DAYS = 1000 * 60 * 60 * 24;

export interface CacheOptions {
  root?: string;
  maxAge?: number;
}

export default class Cache {
  private cwd: string;
  private cwdHash: string;
  private root: string;
  private maxAge: number;

  constructor(options: CacheOptions = {}) {
    this.cwd = process.cwd();
    this.cwdHash = shortHash(process.cwd());
    this.root = options.root || path.join(tmpdir(), 'ts-swc-loaders');
    this.maxAge = options.maxAge || 1 * MS_TO_DAYS;
  }

  cachePath(filePath: string, options: object = {}) {
    const relFilePath = path.relative(this.cwd, filePath);
    const basename = path.basename(relFilePath);
    const dirHash = `${shortHash(path.dirname(relFilePath))}-${shortHash(JSON.stringify(options))}`;
    return path.join(this.root, this.cwdHash, dirHash, `${basename}.json`);
  }

  get(cachePath) {
    const record = this.getRecord(cachePath);
    return record ? record.data : null;
  }

  getRecord(cachePath) {
    try {
      const record = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const time = timeMS();
      if (time - record.time > this.maxAge) {
        unlinkSafe(cachePath);
        return null;
      }
      return record;
    } catch (_err) {
      return null;
    }
  }

  getOrUpdate(cachePath, contents, fn) {
    const hash = shortHash(contents);
    const record = this.getRecord(cachePath);
    if (record && record.hash === hash) return record.data;

    // miss
    const data = fn(contents);
    this.set(cachePath, data, { hash: hash });
    return data;
  }

  set(cachePath, data, options) {
    options = options || {};
    const record = {
      data: data,
      time: options.time || timeMS(),
      hash: options.hash,
    };
    mkdirp.sync(path.dirname(cachePath));
    fs.writeFileSync(cachePath, JSON.stringify(record), 'utf8');
  }
}
