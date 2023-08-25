// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import documentation from "./separate-declarators.md";
import type { VisitorModule } from "../../../types";

export const separateDeclarators: VisitorModule = {
  kind: "visitor",
  documentation,
  visitor: () => ({
    VariableDeclaration: (path) => {
      if (!t.isBlock(path.parentPath.node)) {
        return;
      }

      if (path.node.declarations.length > 1) {
        const kind = path.node.kind;
        const newDeclarations = path.node.declarations.map((declarator) =>
          t.variableDeclaration(kind, [declarator])
        );

        path.replaceWithMultiple(newDeclarations);
      }
    },
  }),
};
