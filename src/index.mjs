import fs from "node:fs";
import path from "node:path";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToVanCode } from "./htmlToVanCode.mjs";
import process from "node:process";

const cwd = process.cwd();

/** @typedef {import("vanjs-core").PropsWithKnownKeys<SVGSVGElement>} PropsWithKnownKeys */
/** @typedef {import("vite").ResolvedConfig} ResolvedConfig */
/** @typedef {typeof import("./types").VitePluginVanSVG} VitePluginVanSVG */

/**
 * Compiles SVGs to VanJS component code
 * @param {string} svgCode
 * @returns {string} the compiled code
 */
function transformSvgToVanJS(svgCode) {
  // Convert the SVG string directly to VanJS code using htmlToVanCode
  const vanCode = htmlToVanCode(svgCode);

  // Wrap the converted code in a component
  const componentCode = `
import van from 'vanjs-core';

export default function SVGComponent(props = {}) {
	const { ${vanCode.tags.join(", ")} } = van.tags("http://www.w3.org/2000/svg");
	return ${vanCode.code}
}
`.trim();

  return componentCode;
}

/** @type {VitePluginVanSVG} */
export default function vitePluginSvgVan(options = {}) {
  const {
    esbuildOptions,
    include = ["**/*.svg?van"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {Partial<ResolvedConfig>} */
  let config;

  return {
    name: "vanjs-svg",
    enforce: "pre",
    // istanbul ignore next - impossible to test outside of vite runtime
    configResolved(cfg) {
      config = cfg;
    },
    async load(id) {
      if (filter(id)) {
        const file = id.replace(postfixRE, "");
        // Resolve the file path
        /* istanbul ignore next @preserve - we cannot test this outside the vite runtime */
        const filePath =
          !file.startsWith(cwd) && file.startsWith("/") && config?.publicDir
            ? path.resolve(config.publicDir, file.slice(1))
            : file;

        // Read the SVG file
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to VanJS component
        const componentCode = transformSvgToVanJS(svgCode);

        // Transform the component code using esbuild
        const result = await transformWithEsbuild(componentCode, id, {
          loader: "js",
          ...esbuildOptions,
        });

        return {
          code: result.code,
          map: null,
        };
      }
      return null;
    },
  };
}
