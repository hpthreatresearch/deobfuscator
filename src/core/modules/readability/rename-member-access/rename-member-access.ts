// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import documentation from "./rename-member-access.md";
import type { VisitorModule } from "../../../types";

/**
 * Simplified charset, for anything more complex we might as well leave it in a string
 */
const ID_START = /[$_a-zA-Z]/;
const ID_CONTINUE = /[$_0-9a-zA-Z]/;

const ValidIdentifier = new RegExp(
  "^" + ID_START.source + ID_CONTINUE.source + "*$"
);

const isValidIdentifier = (str: string): boolean =>
  str.match(ValidIdentifier) !== null;

/**
 * Transforms member access using [] to .
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
export const removeMemberAccess: VisitorModule = {
  kind: "visitor",
  documentation,
  visitor: () => ({
    MemberExpression: (path) => {
      if (
        path.node.computed &&
        t.isStringLiteral(path.node.property) &&
        isValidIdentifier(path.node.property.value)
      ) {
        const memberExpression = t.memberExpression(
          path.node.object,
          t.identifier(path.node.property.value)
        );
        path.replaceWith(memberExpression);
      }
    },
  }),
};
