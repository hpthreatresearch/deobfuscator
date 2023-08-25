// © Copyright 2023 HP Development Company, L.P.
import * as parser from "@babel/parser";
import * as t from "@babel/types";
import type { VisitorModule } from "@core/types";
import { ReplaceExpressionModule } from "./ReplaceExpressionModule";

export const replaceExpression: VisitorModule = {
  kind: "visitor",
  ModuleComponent: ReplaceExpressionModule,
  visitor: (params: any) => {
    const find: string = (params && params.find) || "";
    const replace: string = (params && params.replace) || "";

    const replaceNode = parser.parseExpression(replace);

    return {
      enter: (path) => {
        if (!t.isExpression) {
          return;
        }

        if (path.toString() === find) {
          const { loc } = path.node;
          path.replaceWith(replaceNode);
          path.node.loc = loc;
        }
      },
    };
  },
};
