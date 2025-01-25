import fs from "node:fs";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToVanCode } from "vanjs-converter";

/** @typedef {typeof import("./types.d.ts").VitePluginVanSVG} VitePluginVanSVG */
/** @typedef {import("vanjs-converter").HtmlToVanCodeOptions} HtmlToVanCodeOptions */

/**
 * Compiles SVGs to VanJS component code
 * @param {string} svgCode
 * @param {HtmlToVanCodeOptions} options
 * @returns {string} the compiled code
 */
function transformSvgToVanJS(svgCode, options = /* istanbul ignore next */{}) {
  // Convert the SVG string directly to VanJS code using htmlToVanCode
  const vanCode = htmlToVanCode(svgCode, {
    ...options,
  });

  // Wrap the converted code in a component
  const componentCode = `
import van from 'vanjs-core';

export default function SVGComponent(props = {}) {
	const { ${vanCode.tags.join(", ")} } = van.tags("http://www.w3.org/2000/svg");
	const { class: className, style, ...rest } = props;
	const svgTag = ${vanCode.code.join("\n")};

	if (className) svgTag.className = className;
	if (style) Object.assign(svgTag.style, style);
	Object.assign(svgTag, rest);

	return svgTag;
}
`.trim();

  return componentCode;
}

/** @type {VitePluginVanSVG} */
export default function vitePluginSvgVan(options = {}) {
	const {
		converterOptions,
		esbuildOptions,
		include = ["*.svg?van"],
		exclude,
	} = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;

  return {
    name: "vanjs-svg",
    enforce: "pre",
    async load(id) {
      if (filter(id)) {
        const filePath = id.replace(postfixRE, "");
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to VanJS component
        const componentCode = transformSvgToVanJS(svgCode, converterOptions);

        // Transform the component code using esbuild
        const res = await transformWithEsbuild(componentCode, id, {
          loader: "js",
          ...esbuildOptions,
        });

        return {
          code: res.code,
          // code: componentCode,
          map: null,
        };
      }
			return null;
    },
  };
}
