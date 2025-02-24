import { Parser } from "@thednp/domparser/parser";

/** @typedef {typeof import("./types").DOMToVan} DOMToVan */
/** @typedef {typeof import("./types").htmlToDOM} htmlToDOM */
/** @typedef {import("@thednp/domparser").RootLike} RootLike */
/** @typedef {import("@thednp/domparser").NodeLike} NodeLike */
/** @typedef {import("@thednp/domparser").ChildLike} ChildLike */
/** @typedef {import("@thednp/domparser").ParseResult} ParseResult */
/** @typedef {typeof import("./types").htmlToVanCode} htmlToVanCode */

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 * @type {typeof import('./types').quoteText}
 */
export const quoteText = (key) =>
  /^[a-zA-Z_][a-zA-Z_0-9]+$/.test(key) ? key : `"${key}"`;

/**
 * Converts HTML to VanJS code.
 *
 * @type {htmlToDOM}
 */
const htmlToDOM = (input) => {
  if (!input) {
    return {
      root: { nodeName: "#document", children: [] },
      tags: [],
      components: [],
    };
  }
  if (typeof input !== "string") throw new TypeError("input must be a string");
  return Parser().parseFromString(input);
};

/**
 * Converts a `DOMNode` to a VanJS code string
 * @type {DOMToVan}
 */
const DOMToVan = (input, depth = 0) => {
  const { tagName, nodeName, attributes, children, nodeValue } = input;
  const isText = nodeName === "#text";
  const firstChildIsText = children?.[0]?.nodeName === "#text";
  const attributeEntries = Object.entries(attributes || {});
  const spaces = "  ".repeat(depth); // Calculate spaces based on depth
  let output = isText ? "" : (spaces + `${tagName}(`);

  const attributesHTML =
    (attributeEntries.length
      ? attributeEntries.map(([key, value]) => `${quoteText(key)}: "${value}"`)
        .join(", ")
      : "")
      .concat(depth === 0 ? ", ...props" : "");
  output += !isText ? `{ ${attributesHTML} }` : "";
  output += !isText && children?.length ? "," : "";

  if (children?.length) {
    const childrenCode = children
      // Increase depth for children
      .map((child) =>
        (firstChildIsText
          ? (attributeEntries.length ? " " : "")
          // @ts-expect-error
          : ("\n" + "  ".repeat(depth + 1))) + DOMToVan(child, depth + 1)
      )
      .join(",");
    output += `${childrenCode}`;
  }
  if (nodeValue) {
    output += `"${nodeValue}"`;
  }
  // Adjust newline for closing bracket
  output += isText
    ? ""
    : (children?.length && !firstChildIsText
      ? ("\n" + "  ".repeat(depth + 1) + ")")
      : (")"));

  return output;
};

/**
 * Converts HTML markup to VanJS code.
 *
 * @type {htmlToVanCode}
 */
export const htmlToVanCode = (input) => {
  const { root, components, tags } = htmlToDOM(input);
  if (!root?.children.length) {
    return { code: "", tags: [], components: [], attributes: {} };
  }
  const { tagName, nodeName, attributes, children } = root.children[0];
  // @ts-expect-error
  const code = DOMToVan({ tagName, nodeName, attributes, children });

  return { code, tags, components, attributes };
};
