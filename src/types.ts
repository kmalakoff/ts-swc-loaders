import type { Context } from 'ts-swc-transform';
export type { Context } from 'ts-swc-transform';

export interface PackageJSON {
  type?: string;
  module?: string;
  main?: string;
}

export interface PackageInfo {
  json: PackageJSON;
  dir: string;
}

export interface Resolved {
  url: string;
  format: string;
  shortCircuit: boolean;
}
export type Resolver = (specifier: string, context: Context) => Promise<Resolved>;

export interface Loaded {
  type: string;
  responseURL: string;
  format: string;
  source: Buffer<ArrayBufferLike> | string;
  shortCircuit: boolean;
}
export type Loader = (specifier: string, context: Context) => Promise<Loaded>;

export interface Formatted {
  format: string;
}
export type Formatter = (specifier: string, context: Context) => Promise<Formatted>;

import type cp from 'child_process';
export type SpawnOptions = cp.SpawnOptions;
export interface ParseResult {
  command: string;
  args: string[];
  options: SpawnOptions;
}
