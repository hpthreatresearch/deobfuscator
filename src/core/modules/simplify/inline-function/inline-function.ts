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
import documentation from "./inline-function.md";

const MODEL_EXPRESSION = parseExpression('Function("")');

/**
 * Gets the value from the string literal and stores it in `state.expression`
 */
const NC_getString: NodeComparator = (_, test, state) => {
  if (t.isStringLiteral(test)) {
    state.expression = test.value;
  }
  return true;
};

/**
 * Inline calls to Function
 */
export const inlineFunction: VisitorModule = {
  kind: "visitor",
  initialParams: {},
  visitor: () => {
    return {
      CallExpression: (path) => {
        const state: { expression: string } = { expression: "" };
        if (
          compareTrees(
            MODEL_EXPRESSION,
            path.node,
            NC_AND(NC_STRUCTURE, NC_IDENTIFIERS, NC_getString),
            state
          )
        ) {
          const ast: t.File = parse(state.expression, {
            allowAwaitOutsideFunction: true,
            allowReturnOutsideFunction: true,
            allowNewTargetOutsideFunction: true,
          });

          path.replaceWith(
            t.functionExpression(
              undefined,
              [],
              t.blockStatement(ast.program.body)
            )
          );
        }
      },
    };
  },
  documentation,
};
