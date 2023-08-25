// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { VisitorModule } from "@core/types";
import documentation from "./documentation.md";
import { safeReplace } from "@core/utils";

export const removeAlias: VisitorModule = {
  kind: "visitor",
  initialParams: {},
  visitor: () => {
    return {
      Identifier: (path) => {
        const { node } = path;

        path.scope.crawl();
        const binding = path.scope.getBinding(node.name);

        if (!binding || !binding.constant) return;

        const varPath = binding.path;

        const varNode = varPath.node;

        if (!t.isVariableDeclarator(varNode)) return;

        if (varPath == path.parentPath) return;

        const { id, init } = varNode;

        if (!t.isIdentifier(id) || !t.isIdentifier(init)) {
          return;
        }
        safeReplace(path, t.identifier(init.name));
      },
      // VariableDeclarator: (path) => {
      //   const { node } = path;
      //   const { id, init } = node;

      //   if (!t.isIdentifier(id) || !t.isIdentifier(init)) {
      //     return;
      //   }

      //   forEachReference(path, id.name, (referencePath) => {
      //     referencePath.replaceWith(t.identifier(init.name));
      //   });
      // },
    };
  },
  documentation,
};
