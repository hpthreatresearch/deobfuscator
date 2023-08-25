// © Copyright 2023 HP Development Company, L.P.
import type { VisitorModule } from "../../../types";
import documentation from "./remove-int-hex.md";

/**
 * Remove hex from ints
 *
 * Example:
 * ```js
 *  0x00
 * ```
 *
 * Becomes
 * ```js
 * 0
 * ```
 */
export const removeIntHex: VisitorModule = {
  kind: "visitor",
  documentation,
  visitor: () => ({
    NumericLiteral: (path) => {
      const old_loc = path.node.loc;
      if (path.node.extra) delete path.node.extra;
      path.node.loc = old_loc;
    },
  }),
};
