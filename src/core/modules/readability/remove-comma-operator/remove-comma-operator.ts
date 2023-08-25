// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import documentation from "./remove-comma-operator.md";
import type { VisitorModule } from "../../../types";

/**
 * Remove comma operator
 *
 * Example:
 * ```js
 *  1,2,3,4;
 * ```
 *
 * Becomes
 * ```js
 * 1;
 * 2;
 * 3;
 * 4;
 * ```
 */
export const removeCommaOperator: VisitorModule = {
  kind: "visitor",
  documentation,
  visitor: () => ({
    SequenceExpression: (path) => {
      const { node, parent } = path;

      if (t.isExpressionStatement(parent)) {
        path.replaceWithMultiple(
          node.expressions.map((e) => {
            const n = t.expressionStatement(e);
            n.loc = e.loc;
            return n;
          })
        );
      }
    },
  }),
};
