// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { SupportedParams, VisitorModule } from "@core/types";
import documentation from "./remove-single-args.md";

export interface RemoveSingleArgsParams extends SupportedParams {
  replaceAll: boolean;
  ignore: string;
}

const INITIAL_PARAMS: RemoveSingleArgsParams = {
  replaceAll: false,
  ignore: "[#KEEP ARGS#]",
};

/**
 * removes proxy functions
 *
 * Example:
 * ```js
 * function add(a) {console.log(a); return (a + 5)};
 * add(1);
 * ```
 *
 * Becomes
 * ```js
 * function add(a) {console.log(1); return (1 + 5)};
 * add(1);
 * ```
 */
export const removeSingleArgs: VisitorModule = {
  kind: "visitor",
  documentation,
  initialParams: INITIAL_PARAMS,
  visitor: (params) => {
    const { replaceAll, ignore } = { ...INITIAL_PARAMS, ...params };
    return {
      Function: (path) => {
        const { parent, node } = path;
        const { params } = node;

        if (
          node.leadingComments &&
          node.leadingComments.some(
            (comment) => comment.value.indexOf(ignore) > -1
          )
        ) {
          return;
        }

        let _arguments: t.Node[] = [];

        // Gets the only arguments to replace them in the function
        if (t.isFunctionExpression(node) && t.isCallExpression(parent)) {
          _arguments = parent.arguments;
        } else if (t.isFunctionDeclaration(node)) {
          const { id } = node;
          if (!id) return;

          path.scope.crawl();

          const binding = path.scope.getBinding(id.name);
          if (!binding) return;

          const { constant, referencePaths } = binding;
          if (!constant) return;
          if (referencePaths.length !== 1) return;

          const referencePath = referencePaths[0];
          if (!t.isCallExpression(referencePath.parent)) return;

          _arguments = referencePath.parent.arguments;
        } else {
          return;
        }

        path.scope.crawl();
        for (const [i, param] of params.entries()) {
          if (!t.isIdentifier(param)) {
            continue;
          }

          /**
           * Allowing for non literal arguments can lead to scope issues
           * it is not recommended by default
           */
          if (!t.isLiteral(_arguments[i]) && !replaceAll) continue;

          const binding = path.scope.getBinding(param.name);
          if (!binding) return;

          const { constant, referencePaths } = binding;
          if (!constant) return;

          for (const referencePath of referencePaths) {
            if (!referencePath) continue;

            const old_loc = referencePath.node.loc;
            referencePath.replaceWith(_arguments[i]);
            referencePath.node.loc = old_loc;
          }
        }
      },
    };
  },
};
