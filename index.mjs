import fs from "node:fs";
import JSON5 from "json5";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToVanCode } from "vanjs-converter";

/** @typedef {import("vanjs-core").PropsWithKnownKeys<SVGSVGElement>} PropsWithKnownKeys */
/** @typedef {typeof import("./types.d.ts").VitePluginVanSVG} VitePluginVanSVG */
/** @typedef {import("vanjs-converter").HtmlToVanCodeOptions} HtmlToVanCodeOptions */

/**
 * Compiles SVGs to VanJS component code
 * @param {string} svgCode
 * @param {HtmlToVanCodeOptions} options
 * @returns {string} the compiled code
 */
function transformSvgToVanJS(svgCode, options = /* istanbul ignore next */ {}) {
  // Convert the SVG string directly to VanJS code using htmlToVanCode
  const vanCode = htmlToVanCode(svgCode, {
    ...options,
  });

  /**
   * @returns {string}
   */
  const getCode = () => {
    let isInitialProps = false;
    /** @type {string[]} */
    const result = [];
    // console.log(vanCode.code);
    vanCode.code.forEach((code) => {
      if (
        ["xmlns", "xmlns:xlink", "viewBox"].some((c) => code.includes(c)) &&
        !isInitialProps
      ) {
        isInitialProps = true;
        console.log("vanCode.code.forEach -> code\n", code);
        const initialProps = JSON5.parse(
          code.replace("svg(", "").replace("},", "}"),
        );
        const { width, height, class: className, style, ...rest } =
          initialProps;
        const output = `
svg({
	${
          Object.entries(rest).map(([key, value]) => `"${key}": "${value}"`)
            .join(",\n")
        },
	width: van.derive(() => props.width || ${width || '""'}),
	height: van.derive(() => props.width || ${height || '""'}),
	class: van.derive(() => props.class || ${className || '""'}),
	style: van.derive(() => props.style || ${style || '""'}),
},
`.trim();

        result.push(output);
        return;
      }
      result.push(code);
    });

    return result.join("\n");
  };

  // Wrap the converted code in a component
  const componentCode = `
import van from 'vanjs-core';

export default function SVGComponent(props = {}) {
	const { ${vanCode.tags.join(", ")} } = van.tags("http://www.w3.org/2000/svg");

	const svgComponent = ${getCode()};
	return svgComponent;
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
    apply: "build",
    async load(id) {
      if (filter(id)) {
        const filePath = id.replace(postfixRE, "");
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to VanJS component
        const componentCode = transformSvgToVanJS(svgCode, converterOptions);
        // console.log('transformSvgToVanJS', componentCode);

        // Transform the component code using esbuild
        const result = await transformWithEsbuild(componentCode, id, {
          loader: "js",
          ...esbuildOptions,
        });

        console.log("transformWithEsbuild\n", result.code);

        return {
          code: result.code,
          // code: componentCode,
          map: null,
        };
      }
      return null;
    },
  };
}
