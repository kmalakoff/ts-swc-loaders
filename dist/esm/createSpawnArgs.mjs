const importArgs = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-swc-loaders", pathToFileURL("./"));';
export default function createSpawnArgs(type, options, major) {
    if (type === 'module') {
        if (major >= 18) {
            return {
                args: [
                    '--no-warnings=ExperimentalWarning',
                    '--import',
                    importArgs
                ],
                options
            };
        }
        const NODE_OPTIONS = `--loader ts-swc-loaders${major < 11 ? ' --experimental-modules' : ''}`;
        const spawnOptions = {
            ...options || {}
        };
        spawnOptions.env = {
            ...spawnOptions.env || {}
        };
        spawnOptions.env.NODE_OPTIONS = `${NODE_OPTIONS}${spawnOptions.env.NODE_OPTIONS ? ` ${spawnOptions.env.NODE_OPTIONS}` : ''}`;
        return {
            args: major >= 10 ? [
                '--no-warnings=ExperimentalWarning'
            ] : [],
            options: spawnOptions
        };
    }
    // commonjs
    return {
        args: [
            '--require',
            'ts-swc-loaders'
        ],
        options
    };
}
