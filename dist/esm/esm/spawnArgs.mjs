import process from 'process';
import createSpawnArgs from '../createSpawnArgs.mjs';
const local = +process.versions.node.split('.')[0];
export default function spawnArgs(type, options, major) {
    return createSpawnArgs(type, options, major || local);
}
