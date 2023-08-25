// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { NodePath } from "@babel/traverse";

import type { VisitorModule } from "@core/types";
import { safeReplace } from "@core/utils";
import { replaceProxyFunctionCall, saveProperties } from "../utils";
import documentation from "./remove-proxy-objects.md";

const INITIAL_PARAMS = {
  keep: false,
  ignore: "[#NOT PROXY#]",
};

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
const removeProxyObjectHelper = (
  path: NodePath<t.Node>,
  node: t.MemberExpression,
  isFunction = false,
  f_node = null
) => {
  const { property, object } = node;

  if (
    !(
      (t.isIdentifier(property) || t.isStringLiteral(property)) &&
      t.isIdentifier(object)
    )
  ) {
    return;
  }

  const key = t.isStringLiteral(property) ? property.value : property.name;

  path.scope.crawl();
  const binding = path.scope.getBinding(object.name);

  if (!binding || !binding.constant) return;

  const objPath = binding.path;

  const objNode = objPath.node;

  if (!t.isVariableDeclarator(objNode)) return;

  if (!t.isIdentifier(objNode.id) || !t.isObjectExpression(objNode.init)) {
    return;
  }

  // TODO:
  // if (
  //   objNode.leadingComments &&
  //   objNode.leadingComments.some(
  //     (comment) => comment.value.indexOf(ignore) > -1
  //   )
  // ) {
  //   return;
  // }

  const { properties } = objNode.init;

  const [proxyValues, proxyFunctions] = saveProperties(properties);

  if (isFunction) {
    const proxyFunction = proxyFunctions.get(key);
    if (!proxyFunction) {
      return;
    }
    const newNode = replaceProxyFunctionCall(proxyFunction, f_node as any);
    if (!newNode) {
      return;
    }
    safeReplace(path, newNode);
  } else {
    const proxyValue = proxyValues.get(key);
    if (!proxyValue) {
      return;
    }

    safeReplace(path, t.cloneDeepWithoutLoc(proxyValue));
  }
};

export const removeProxyObject: VisitorModule = {
  kind: "visitor",
  documentation,
  initialParams: INITIAL_PARAMS,
  visitor: (params?: object) => {
    // TODO: keep
    const { ignore } = { ...INITIAL_PARAMS, ...params };

    return {
      CallExpression: {
        exit: (path) => {
          const { node } = path;
          if (!t.isMemberExpression(node.callee)) return;

          removeProxyObjectHelper(path, node.callee, true, node as any);
        },
      },
      MemberExpression: {
        exit: (path) => {
          const { node } = path;

          if (t.isCallExpression(path.parent) && path.key === "callee") return;

          removeProxyObjectHelper(path, node);
        },
      },
      VariableDeclarator: (path) => {
        const { node, parent, parentPath } = path;

        if (!t.isIdentifier(node.id) || !t.isObjectExpression(node.init)) {
          return;
        }

        if (
          node.leadingComments &&
          node.leadingComments.some(
            (comment) => comment.value.indexOf(ignore) > -1
          )
        ) {
          return;
        }

        const { loc } = node;
        const { name } = node.id;
        const { properties } = node.init;

        /**
         * expands object to take into account mutations happening in the next lines
         */
        if (parent) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const sibling = parentPath.getNextSibling();
            if (
              !sibling ||
              !t.isExpressionStatement(sibling.node) ||
              !t.isAssignmentExpression(sibling.node.expression) ||
              !t.isMemberExpression(sibling.node.expression.left) ||
              !t.isIdentifier(sibling.node.expression.left.object, { name }) ||
              !(
                t.isStringLiteral(sibling.node.expression.left.property) ||
                t.isIdentifier(sibling.node.expression.left.property)
              )
            ) {
              break;
            }
            if (loc && sibling.node.loc) {
              loc.end = sibling.node.loc?.end;
            }

            properties.push(
              t.objectProperty(
                sibling.node.expression.left.property,
                sibling.node.expression.right
              )
            );

            sibling.remove();
          }
        }
      },

      // VariableDeclarator: (path) => {
      //   const { node, parent, parentPath } = path;

      //   if (!t.isIdentifier(node.id) || !t.isObjectExpression(node.init)) {
      //     return;
      //   }

      //   if (
      //     node.leadingComments &&
      //     node.leadingComments.some(
      //       (comment) => comment.value.indexOf(ignore) > -1
      //     )
      //   ) {
      //     return;
      //   }

      //   const { loc } = node;
      //   const { name } = node.id;
      //   const { properties } = node.init;

      //   /**
      //    * expands object to take into account mutations happening in the next lines
      //    */
      //   if (parent) {
      //     // eslint-disable-next-line no-constant-condition
      //     while (true) {
      //       const sibling = parentPath.getNextSibling();
      //       if (
      //         !sibling ||
      //         !t.isExpressionStatement(sibling.node) ||
      //         !t.isAssignmentExpression(sibling.node.expression) ||
      //         !t.isMemberExpression(sibling.node.expression.left) ||
      //         !t.isIdentifier(sibling.node.expression.left.object, { name }) ||
      //         !(
      //           t.isStringLiteral(sibling.node.expression.left.property) ||
      //           t.isIdentifier(sibling.node.expression.left.property)
      //         )
      //       ) {
      //         break;
      //       }
      //       if (loc && sibling.node.loc) {
      //         loc.end = sibling.node.loc?.end;
      //       }

      //       properties.push(
      //         t.objectProperty(
      //           sibling.node.expression.left.property,
      //           sibling.node.expression.right
      //         )
      //       );

      //       sibling.remove();
      //     }
      //   }

      //   const [proxyValues, proxyFunctions] = saveProperties(properties);

      //   forEachReference(path, name, (referencePath) => {
      //     if (
      //       !referencePath ||
      //       !t.isIdentifier(referencePath.node, { name: name })
      //     ) {
      //       return;
      //     }

      //     const { parentPath } = referencePath;

      //     if (!parentPath || !t.isMemberExpression(parentPath.node)) {
      //       return;
      //     }

      //     const { object, property } = parentPath.node;

      //     if (
      //       !(
      //         (t.isIdentifier(property) || t.isStringLiteral(property)) &&
      //         t.isIdentifier(object)
      //       )
      //     ) {
      //       return;
      //     }

      //     const key = t.isStringLiteral(property)
      //       ? property.value
      //       : property.name;

      //     // sanity check
      //     if (!parentPath || !parentPath.parentPath) {
      //       return;
      //     }

      //     const grandParent = parentPath.parentPath.node;

      //     if (t.isCallExpression(grandParent) && parentPath.key === "callee") {
      //       // sanity checks
      //       if (
      //         !t.isMemberExpression(grandParent.callee) ||
      //         !t.isIdentifier(grandParent.callee.object, {
      //           name: name,
      //         })
      //       ) {
      //         return;
      //       }

      //       const proxyFunction = proxyFunctions.get(key);

      //       if (!proxyFunction) {
      //         return;
      //       }

      //       const newNode = replaceProxyFunctionCall(
      //         proxyFunction,
      //         grandParent
      //       );

      //       if (!newNode) {
      //         return;
      //       }

      //       safeReplace(parentPath.parentPath, newNode);
      //     } else {
      //       const proxyValue = proxyValues.get(key);
      //       if (!proxyValue) {
      //         return;
      //       }

      //       safeReplace(parentPath, t.cloneDeepWithoutLoc(proxyValue));
      //     }
      //   });
      // },
    };
  },
};
