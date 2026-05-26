const EXT_TO_FORMAT: Record<string, string> = {
  '.json': 'json',
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

export default function extToFormat(ext: string): string {
  return EXT_TO_FORMAT[ext];
}
