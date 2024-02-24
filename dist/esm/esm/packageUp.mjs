import fs from 'fs';
import path from 'path';
const packageJSONCache = new Map();
function getPackage(packagePath) {
    const existing = packageJSONCache.get(packagePath);
    if (existing !== undefined) return existing;
    try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        packageJSONCache.set(packagePath, packageJson);
        return packageJson;
    } catch (_err) {
        packageJSONCache.set(packagePath, null);
        return null;
    }
}
export default function packageUp(filePath) {
    let dir = filePath;
    while(dir){
        if (dir.endsWith('node_modules')) break;
        const json = getPackage(path.join(dir, 'package.json'));
        if (json) return {
            json,
            dir
        };
        dir = path.dirname(dir);
    }
    return null;
}
