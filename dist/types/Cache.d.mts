export default class Cache {
    constructor(options: any);
    cwd: string;
    cwdHash: any;
    root: any;
    maxAge: any;
    cachePath(filePath: any, options: any): string;
    get(cachePath: any): any;
    getRecord(cachePath: any): any;
    getOrUpdate(cachePath: any, contents: any, fn: any): any;
    set(cachePath: any, data: any, options: any): void;
}
