const EXT_TO_FORMAT = {
    '.json': 'json',
    '.mjs': 'module',
    '.mts': 'module',
    '.cjs': 'commonjs',
    '.cts': 'commonjs'
};
export default function extToFormat(ext) {
    return EXT_TO_FORMAT[ext];
}
