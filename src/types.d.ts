/// <reference path="global.d.ts" />

import type {
  ChildLike,
  DOMNode,
  NodeLike,
  ParseResult,
  RootNode,
} from "@thednp/domparser";
import type { FilterPattern } from "@rollup/pluginutils";
import type { DomParserOptions } from "@thednp/domparser";
import { type ResolvedConfig, transformWithEsbuild } from "vite";
import type {
  PropsWithKnownKeys,
  PropValueOrDerived,
  State,
  TagFunc,
} from "vanjs-core";

export type VitePluginSvgVanOptions = Partial<ResolvedConfig> & {
  esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
  exclude?: FilterPattern;
  include?: FilterPattern;
};

export declare const VitePluginVanSVG: (config?: VitePluginSvgVanOptions) => {
  name: string;
  enforce: "pre" | "post" | undefined;
  configResolved: (cfg: ResolvedConfig) => void;
  load: (id: string) => Promise<{ code: string; map: null } | null>;
};
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
