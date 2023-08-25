// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { VisitorModule } from "../../../types";
import documentation from "./remove-dead-branches.md";

/**
 * Remove dead branches
 *  - If statements
 *  - Conditional expressions
 *  - while false statements
 *
 * Example:
 * ```js
 *  a["toString"]()
 * ```
 *
 * Becomes
 * ```js
 * a.toString()
 * ```
 */
export const removeDeadBranches: VisitorModule = {
  documentation,
  kind: "visitor",
  /**
   * TODO: Add a keep parameter to force keep dead branches
   */
  visitor: () => ({
    IfStatement: (path) => {
      if (t.isBooleanLiteral(path.node.test)) {
        const test = path.node.test.value;

        // Replace the if statement with the correct branch
        if (test) {
          if (path.node.alternate) {
            if (
              t.isBlockStatement(path.node.alternate) &&
              path.node.alternate.body.length === 0
            )
              return;

            path.replaceWith(
              t.ifStatement(
                path.node.test,
                path.node.consequent,
                t.blockStatement([])
              )
            );
          }
        } else {
          // Is there an else block ?
          if (
            t.isBlockStatement(path.node.consequent) &&
            path.node.consequent.body.length === 0
          )
            return;

          if (path.node.alternate) {
            path.replaceWith(
              t.ifStatement(
                path.node.test,
                t.blockStatement([]),
                path.node.alternate
              )
            );
          } else {
            path.replaceWith(
              t.ifStatement(path.node.test, t.blockStatement([]))
            );
          }
        }
      }
    },

    ConditionalExpression: (path) => {
      if (t.isBooleanLiteral(path.node.test)) {
        const test = path.node.test.value;

        // Replace the if statement with the correct branch
        if (test) {
          path.replaceWith(path.node.consequent);
        } else {
          path.replaceWith(path.node.alternate);
        }
      }
    },

    WhileStatement: (path) => {
      if (t.isBooleanLiteral(path.node.test) && !path.node.test.value) {
        if (
          t.isBlockStatement(path.node.body) &&
          path.node.body.body.length === 0
        )
          return;
        path.replaceWith(
          t.whileStatement(path.node.test, t.blockStatement([]))
        );
      }
    },
  }),
};
