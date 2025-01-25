import type { FilterPattern } from "@rollup/pluginutils";
import { transformWithEsbuild } from "vite";
import type { PropsWithKnownKeys } from "vanjs-core";
import type { HtmlToVanCodeOptions } from 'vanjs-converter'

export interface VitePluginSvgVanOptions {
    converterOptions?: HtmlToVanCodeOptions;
    esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
    exclude?: FilterPattern;
    include?: FilterPattern;
}

export declare const VitePluginVanSVG: (config?: VitePluginSvgVanOptions) => {
    name: "vanjs-svg";
    enforce: "pre" | "post" | undefined;
    // apply: "build";
    load: (id: string) => Promise<{ code: string; map: null } | null>;
};
export default VitePluginVanSVG;

declare global {
    declare module "*.svg?van" {
        const svg = (props: PropsWithKnownKeys<SVGSVGElement>) => SVGSVGElement;
        export default svg;
    }
}
