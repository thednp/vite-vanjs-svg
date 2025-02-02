/// <reference path="global.d.ts" />
/// <reference types="vite-plugin-vanjs" />

import type { FilterPattern } from "@rollup/pluginutils";
import { transformWithEsbuild, type UserConfig } from "vite";
import type {
  PropsWithKnownKeys,
  PropValueOrDerived,
  State,
  TagFunc,
} from "vanjs-core";
import type { HtmlToVanCodeOptions } from "vanjs-converter";

export interface VitePluginSvgVanOptions {
  converterOptions?: HtmlToVanCodeOptions;
  esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
  exclude?: FilterPattern;
  include?: FilterPattern;
}

export declare const VitePluginVanSVG: (config?: VitePluginSvgVanOptions) => {
  name: "vanjs-svg";
  enforce: "pre" | "post" | undefined;
  config: () => {
    resolve: {
      alias: Record<string, string>;
    };
  };
  configResolved: (cfg: UserConfig) => void;
  load: (id: string) => Promise<{ code: string; map: null } | null>;
};
export default VitePluginVanSVG;
