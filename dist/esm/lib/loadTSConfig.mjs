import getTS from 'get-tsconfig-compat';
export default function loadTSConfig(path) {
    let config = getTS.getTsconfig(path);
    if (!config || !config.path) {
        console.log(`tsconfig.json not found at: ${path}`);
        config = {};
    }
    config.path = config.path || '';
    config.config = config.config || {};
    config.config.compilerOptions = config.config.compilerOptions || {};
    config.config.include = config.config.include || [];
    return config;
}
