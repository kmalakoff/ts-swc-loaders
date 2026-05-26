declare module 'pirates' {
  type Matcher = (filename: string) => boolean;
  export type Transform = (code: string, filename: string) => string;
  export interface Options {
    exts?: string[];
    matcher?: Matcher;
    ignoreNodeModules?: boolean;
  }
  export type RevertFunction = () => void;
  interface PiratesModule {
    addHook(transform: Transform, options?: Options): RevertFunction;
  }
  const pirates: PiratesModule;
  export default pirates;
}
