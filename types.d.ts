import type { FilterPattern } from "@rollup/pluginutils";
import { transformWithEsbuild } from "vite";
import type { PropsWithKnownKeys, TagFunc } from "vanjs-core";
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
  load: (id: string) => Promise<{ code: string; map: null } | null>;
};
export default VitePluginVanSVG;

declare global {
  declare module "*.svg?van" {
    const SVGTag: (
      props?: PropsWithKnownKeys<SVGElement>,
    ) => ReturnType<TagFunc<SVGElement>>;
    export default SVGTag;
  }
}
