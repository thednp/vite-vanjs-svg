/// <reference path="global.d.ts" />

import type {
  ChildLike,
  DOMNode,
  DomParserOptions,
  NodeLike,
  ParseResult,
  RootNode,
} from "@thednp/domparser";
import type { FilterPattern } from "@rollup/pluginutils";
import type {
  EsbuildTransformOptions,
  OxcOptions,
  Plugin,
  ResolvedConfig,
} from "vite";
import type {
  PropsWithKnownKeys,
  PropValueOrDerived,
  State,
  TagFunc,
} from "vanjs-core";

export type VitePluginSvgVanOptions = {
  oxcOptions?: OxcOptions;
  /** @deprecated */
  esbuildOptions?: EsbuildTransformOptions;
  exclude?: FilterPattern;
  include?: FilterPattern;
};

export declare const VitePluginVanSVG: (
  config?: VitePluginSvgVanOptions,
) => Plugin<VitePluginSvgVanOptions>;
export default VitePluginVanSVG;

export type VanJSCode = {
  code: string;
  tags: string[];
  components: string[];
  attributes?: Record<string, string>;
};

type ChildEl = ChildLike & Omit<NodeLike, "attributes"> & {
  attributes: string | Record<string, string>;
} & {
  children: ChildLike[];
};

/**
 * Converts a `ChildLike` to a VanJS code string
 * @param input
 * @param depth
 */
export const DOMToVan: (input: ChildEl, depth?: number) => string;

/**
 * Converts HTML to VanJS code.
 */
export const htmlToVanCode: (
  input?: string,
) => VanJSCode;

/** Converts HTML to DOMLike */
export const htmlToDOM: (
  input?: string,
) => ParseResult;

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 */
export const quoteText: (key: string) => string;
