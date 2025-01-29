import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToVanCode } from "vanjs-converter";

/** @typedef {import("vanjs-core").PropsWithKnownKeys<SVGSVGElement>} PropsWithKnownKeys */
/** @typedef {import("vite").UserConfig} UserConfig */
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

  /** @returns {string} */
  const getCode = () => {
    let isInitialProps = false;
    /** @type {string[]} */
    const result = [];
    vanCode.code.forEach((code) => {
      if (
        ["xmlns", "viewBox"].some((c) => code.includes(c)) &&
        !isInitialProps
      ) {
        isInitialProps = true;
        const initialProps = JSON5.parse(
          code.replace("svg(", "").replace("},", "}"),
        );
        const {
          transform,
          stroke,
          strokeOpacity,
          strokeWidth,
          fill,
          fillOpacity,
          width,
          height,
          class: className,
          style,
          ...rest
        } = initialProps;
        const output = `
const props = {
  ${
          Object.entries(rest)
            .map(([key, value]) => `"${key}": "${value}"`)
            .join(",\n")
        },
};

van.derive(() => {
  if (initialProps.fill) {
    props.fill = initialProps.fill || ${fill};
  }
});

van.derive(() => {
  if (initialProps.fillOpacity) {
    props.fillOpacity = initialProps.fillOpacity || ${fillOpacity};
  }
});

van.derive(() => {
  if (initialProps.stroke) {
    props.stroke = initialProps.stroke || ${stroke};
  }
});

van.derive(() => {
  if (initialProps.strokeOpacity) {
    props.strokeOpacity = initialProps.strokeOpacity || ${strokeOpacity};
  }
});

van.derive(() => {
  if (initialProps.strokeWidth) {
    props.strokeWidth = initialProps.strokeWidth || ${strokeWidth};
  }
});

van.derive(() => {
  if (["null", null].every(w => w !== initialProps.width)) {
    props.width = initialProps.width || ${width};
  }
});

van.derive(() => {
  if (["null", null].every(h => h !== initialProps.height)) {
    props.height = initialProps.height || ${height};
  }
});

van.derive(() => {
  if (initialProps.class) {
    props.class = initialProps.class || ${className};
  }
});

van.derive(() => {
  if (initialProps.style) {
    props.style = initialProps.style || ${style};
  }
});

van.derive(() => {
  if (initialProps.transform) {
    props.transform = initialProps.transform || ${transform};
  }
});

return svg(props,
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

export default function SVGComponent(initialProps = {}) {
	const { ${vanCode.tags.join(", ")} } = van.tags("http://www.w3.org/2000/svg");
	${getCode()}
}
`.trim();

  return componentCode;
}

/** @type {VitePluginVanSVG} */
export default function vitePluginSvgVan(options = {}) {
  const {
    converterOptions,
    esbuildOptions,
    include = ["**/*.svg?van"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {UserConfig} */
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
        const filePath = file.startsWith("/") && config?.publicDir
          ? /* istanbul ignore next */ path.resolve(
            config.publicDir,
            file.slice(1),
          )
          : file;
        // Read the SVG file
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to VanJS component
        const componentCode = transformSvgToVanJS(svgCode, converterOptions);

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
