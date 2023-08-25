// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { SupportedParams, VisitorModule } from "../../../types";
import documentation from "./remove-unused-vars.md";

export interface RemoveUnusedVarsParams extends SupportedParams {
  ignore: string;
}

const INITIAL_PARAMS: RemoveUnusedVarsParams = {
  ignore: "[#NOT UNUSED#]",
};

/**
 * Remove unused variables
 *  - keeps variables marked with #KEEP#
 *
 * Example:
 * ```js
 *  var a,
 *  b,
 *  // KEEP
 *  c;
 *
 * a;
 * ```
 *
 * Becomes
 * ```js
 * var a,
 *  // KEEP
 *  c;
 *
 * a;
 * ```
 */
export const removeUnusedVars: VisitorModule = {
  kind: "visitor",
  documentation,
  initialParams: INITIAL_PARAMS,
  visitor: (params) => {
    const { ignore } = { ...INITIAL_PARAMS, ...params };
    return {
      VariableDeclarator: (path) => {
        if (
          path.node.leadingComments &&
          path.node.leadingComments.some(
            (comment) => comment.value.indexOf(ignore) >= 0
          )
        ) {
          return;
        }

        if (!t.isIdentifier(path.node.id)) {
          return;
        }

        path.scope.crawl();
        const binding = path.scope.getBinding(path.node.id.name);

        if (!binding) {
          return;
        }

        if (binding.referenced) {
          return;
        }

        path.remove();
      },

      FunctionDeclaration: (path) => {
        if (
          path.node.leadingComments &&
          path.node.leadingComments.some(
            (comment) => comment.value.indexOf(ignore) >= 0
          )
        ) {
          return;
        }

        if (!t.isIdentifier(path.node.id)) {
          return;
        }

        path.scope.crawl();
        const binding = path.scope.getBinding(path.node.id.name);

        if (!binding) {
          return;
        }

        if (binding.referenced) {
          return;
        }

        path.remove();
      },
    };
  },
};
