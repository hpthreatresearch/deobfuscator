// © Copyright 2023 HP Development Company, L.P.
import type { NodePath } from "@babel/traverse";
import type * as t from "@babel/types";
import type { VisitorModule } from "../../../types";
import documentation from "./remove-string-hex.md";

/**
 * Remove hex from strings
 *
 * Example:
 * ```js
 *  "Hello,\x20World!"
 * ```
 *
 * Becomes
 * ```js
 * "Hello, World!"
 * ```
 */
export const removeStringHex: VisitorModule = {
  kind: "visitor",
  documentation,
  visitor: () => ({
    StringLiteral: (path: NodePath<t.StringLiteral>) => {
      const { node } = path;
      const { loc } = node;

      if (node.extra && node.extra.rawValue) {
        node.extra.raw = JSON.stringify(node.extra.rawValue);
      }
      path.node.loc = loc;
    },
    DirectiveLiteral: (path: NodePath<t.DirectiveLiteral>) => {
      const { node } = path;
      const { loc } = node;

      if (node.extra && node.extra.expressionValue) {
        node.extra.raw = JSON.stringify(node.extra.expressionValue);
      }
      path.node.loc = loc;
    },
  }),
};
