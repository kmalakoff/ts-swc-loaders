import path from 'path';
const major = +process.versions.node.split('.')[0];
const version = major >= 14 ? 'local' : 'lts';
const worker = path.resolve(__dirname, '..', 'workers', 'transformSync.js');
let call = null; // break dependencies
export default function transformSync(contents, filename, config) {
    if (!call) call = require('node-version-call'); // break dependencies
    return call(version, worker, contents, filename, config);
}
