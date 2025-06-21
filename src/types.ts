import type { Context } from 'ts-swc-transform';

export interface ClearOptions {
  silent?: boolean;
}

export interface CacheOptions {
  cachePath?: string;
  maxAge?: number;
}

export interface PackageJSON {
  type?: string;
  module?: string;
  main?: string;
}

export interface PackageInfo {
  json: PackageJSON;
  dir: string;
}

export interface ResolveContext extends Context {}

export interface Resolved {
  url: string;
  format: string;
  shortCircuit: boolean;
}
export type Resolver = (specifier: string, context: ResolveContext) => Promise<Resolved>;

export interface LoadContext extends Context {}

export interface Loaded {
  type: string;
  responseURL: string;
  format: string;
  source: Buffer<ArrayBufferLike> | string;
  shortCircuit: boolean;
}
export type Loader = (specifier: string, context: LoadContext) => Promise<Loaded>;

export interface FormatContext extends Context {}

export interface Formatted {
  format: string;
}
export type Formatter = (specifier: string, context: FormatContext) => Promise<Formatted>;

export interface Transformed {
  source: string;
}
export interface TransformContext extends Context {
  url: string;
}
export type Transformer = (specifier: string, context: TransformContext) => Promise<Transformed>;

import type cp from 'child_process';
export type SpawnOptions = cp.SpawnOptions;
export interface ParseResult {
  command: string;
  args: string[];
  options: SpawnOptions;
}

export interface Compiled {
  code: string;
}
