import * as getTS from 'get-tsconfig-compat';

export default function loadTSConfig(path: string): getTS.TsConfigResult {
  let tsconfig = getTS.getTsconfig(path);
  if (!tsconfig || !tsconfig.path) {
    console.log(`tsconfig.json not found at: ${path}`);
    tsconfig = { path: '', config: {} };
  }
  tsconfig.path = tsconfig.path || '';
  tsconfig.config = tsconfig.config || {};
  tsconfig.config.compilerOptions = tsconfig.config.compilerOptions || {};
  tsconfig.config.include = tsconfig.config.include || [];
  return tsconfig;
}
