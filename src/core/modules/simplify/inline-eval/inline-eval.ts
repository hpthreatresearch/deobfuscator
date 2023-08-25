// © Copyright 2023 HP Development Company, L.P.
import { parse, parseExpression } from "@babel/parser";
import * as t from "@babel/types";
import type { VisitorModule } from "@core/types";
import type { NodeComparator } from "@core/utils";
import {
  NC_AND,
  NC_IDENTIFIERS,
  NC_STRUCTURE,
  compareTrees,
} from "@core/utils";
import documentation from "./inline-eval.md";

const MODEL_EXPRESSION = parseExpression('eval("")');

/**
 * Gets the value from the string literal and stores it in `state.expression`
 */
const NC_getString: NodeComparator = (_, test, state) => {
  if (t.isStringLiteral(test)) {
    state.expression = test.value;
  }
  return true;
};

export const inlineEval: VisitorModule = {
  kind: "visitor",
  initialParams: {},
  visitor: () => {
    return {
      ExpressionStatement: (path) => {
        const state: { expression: string } = { expression: "" };
        if (
          compareTrees(
            MODEL_EXPRESSION,
            path.node.expression,
            NC_AND(NC_STRUCTURE, NC_IDENTIFIERS, NC_getString),
            state
          )
        ) {
          const ast: t.File = parse(state.expression);

          path.replaceWithMultiple(ast.program.body);
        }
      },
    };
  },
  documentation,
};
