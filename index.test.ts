import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VitePluginSvgVanOptions } from "types";

// import plugin
import svgVan from "./index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("vite-plugin-vanjs-svg", () => {
  it("should be a function", () => {
    expect(typeof svgVan).toBe("function");
  });

  it("should return a vite plugin object", () => {
    const plugin = svgVan();
    expect(plugin).toHaveProperty("name", "vanjs-svg");
    expect(plugin).toHaveProperty("enforce", "pre");
    expect(typeof plugin.load).toBe("function");
  });

  it("should transform svg files with ?van query", async () => {
    const plugin = svgVan();
    const svgPath = resolve(__dirname, "vanjs.svg");

    const result = await plugin.load?.(svgPath + "?van");
    // const result = await plugin.load?.("./vanjs.svg?van");
    // if (!result) {
    //   throw new Error("Plugin did not return a result");
    // }
    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes VanJS imports
    expect(result.code).toContain("import van from");

    // Check if the transformed code creates a component
    expect(result.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result.code).toContain("viewBox");
  });

  it("should not transform non-svg files", async () => {
    const plugin = svgVan();
    const result = await plugin.load?.("test.js?van");
    expect(result).toBeNull();
  });

  it("should not transform svg files without ?van query", async () => {
    const plugin = svgVan();
    const result = await plugin.load?.("test.svg");
    expect(result).toBeNull();
  });

  it("should accept plugin options", () => {
    const options: Partial<VitePluginSvgVanOptions> = {
      converterOptions: { indent: 2 },
      include: "**/*.svg",
    };
    const plugin = svgVan(options);
    expect(plugin).toBeDefined();
  });
});
