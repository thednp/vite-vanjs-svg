import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VitePluginSvgVanOptions } from "./types";

// import plugin
import svgVan from "./index.mjs";
import { htmlToVanCode } from "./htmlToVanCode.mjs";

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
    // console.log(result);

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes VanJS imports
    expect(result.code).toContain("import van from");

    // Check if the transformed code creates a component
    expect(result.code).toContain("export default ({ children, ...rest })");

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

  it("should work with attributes", () => {
    // a set of tests to add full coverage
    // while the plugin is designed strictly for SVG
    // we still need to handle React attribute namespace
    const html = `
  <fieldset>
    "This is a text node"
    <button class="btn" aria-disabled="true" data-disabled="true" disabled>click me</button>
    <label for="text-input">Sample label</label>
    <input type="text" id="text-input" name="text-input" value="Sample value" />
  </fieldset>
    `.trim();

    const code = htmlToVanCode(html);
    expect(code.attributes).toEqual({});
  });

  it("should handle invalid markup", () => {
    expect(htmlToVanCode()).toEqual({
      code: "",
      attributes: {},
      tags: [],
      components: [],
    });

    try {
      // @ts-expect-error - we need to test this case
      htmlToVanCode({});
    } catch (er: unknown) {
      expect(er).toBeInstanceOf(TypeError);
      expect((er as TypeError).message).toEqual("input must be a string");
    }
  });

  it("should accept plugin options", () => {
    const options: Partial<VitePluginSvgVanOptions> = {
      include: "**/*.svg",
    };
    const plugin = svgVan(options);
    expect(plugin).toBeDefined();
  });
});
