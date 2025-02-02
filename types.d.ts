/// <reference path="global.d.ts" />
/// <reference types="vite-plugin-vanjs" />

import type { FilterPattern } from "@rollup/pluginutils";
import type { ParserOptions } from "@vanjs/parser";
import { transformWithEsbuild, type UserConfig } from "vite";
import type {
  PropsWithKnownKeys,
  PropValueOrDerived,
  State,
  TagFunc,
} from "vanjs-core";

export interface VitePluginSvgVanOptions {
  converterOptions?: Partial<ParserOptions>;
  esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
  exclude?: FilterPattern;
  include?: FilterPattern;
}

export declare const VitePluginVanSVG: (config?: VitePluginSvgVanOptions) => {
  name: string;
  enforce: "pre" | "post" | undefined;
  configResolved: (cfg: UserConfig) => void;
  load: (id: string) => Promise<{ code: string; map: null } | null>;
};
export default VitePluginVanSVG;
