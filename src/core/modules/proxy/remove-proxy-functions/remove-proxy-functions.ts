// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { VisitorModule } from "@core/types";
import { safeReplace } from "@core/utils";
import { replaceProxyFunctionCall, saveProxyFunction } from "../utils";
import documentation from "./remove-proxy-functions.md";

/**
 * removes proxy functions
 *
 * Example:
 * ```js
 *  function add(a, b) {return a + b};
 * add(1, 2);
 * ```
 *
 * Becomes
 * ```js
 * 1 + 2
 * ```
 */
export const removeProxyFunction: VisitorModule = {
  kind: "visitor",
  documentation,
  initialParams: { keep: false, ignore: "[#NOT PROXY#]" },
  visitor: (params?: object) => {
    const keep = params && "keep" in params ? (params.keep as boolean) : false;
    const ignore =
      params && "ignore" in params
        ? (params.ignore as string)
        : "[#NOT PROXY#]";

    return {
      CallExpression: {
        exit: (path) => {
          const { node } = path;

          if (!t.isIdentifier(node.callee)) return;

          path.scope.crawl();
          const binding = path.scope.getBinding(node.callee.name);

          if (!binding || !binding.constant) return;

          const fnPath = binding.path;

          const fnNode = fnPath.node;

          if (!t.isFunctionDeclaration(fnNode)) {
            return;
          }

          const proxyFunction = saveProxyFunction(fnNode);

          const [name] = proxyFunction;

          if (name === undefined) {
            return;
          }

          const newNode = replaceProxyFunctionCall(proxyFunction, node);

          if (!newNode) {
            return;
          }

          safeReplace(path, newNode);
        },
      },
      // FunctionDeclaration: (path) => {
      //   // eslint-disable-next-line no-constant-condition
      //   if (true) return;

      //   found_one = true;

      //   const { node } = path;

      //   if (
      //     node.leadingComments &&
      //     node.leadingComments.some(
      //       (comment) => comment.value.indexOf(ignore) > -1
      //     )
      //   ) {
      //     return;
      //   }

      //   const proxyFunction = saveProxyFunction(node);

      //   const [name] = proxyFunction;

      //   console.warn(name);

      //   if (name === undefined) {
      //     return;
      //   }

      //   let remove = true;

      //   forEachReference(path, name, (referencePath) => {
      //     remove = !remove;

      //     // sanity check
      //     if (!referencePath || !t.isIdentifier(referencePath.node, { name })) {
      //       return;
      //     }

      //     const { parentPath } = referencePath;

      //     if (!parentPath || !t.isCallExpression(parentPath.node)) {
      //       return;
      //     }

      //     const newNode = replaceProxyFunctionCall(
      //       proxyFunction,
      //       parentPath.node
      //     );

      //     if (!newNode) {
      //       return;
      //     }

      //     safeReplace(parentPath, newNode);

      //     remove = !remove;
      //   });

      //   if (remove && !keep) path.remove();
      // },
    };
  },
};
