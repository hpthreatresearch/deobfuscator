// © Copyright 2023 HP Development Company, L.P.
/* eslint-disable no-restricted-globals */
import * as t from "@babel/types";
import type { SupportedParams, VisitorModule } from "@core/types";
import documentation from "./constant-folding.md";
import { safeEval } from "@core/utils";
const verbose = 0;

interface ConstantFoldingParams extends SupportedParams {
  allowedEval: string[];
  forcedConstant: string;
  evalLists: boolean;
}

const INITIAL_PARAMS: ConstantFoldingParams = {
  allowedEval: [],
  forcedConstant: "#CONSTANT#",
  evalLists: false,
};

export const constantFolding: VisitorModule = {
  documentation,

  kind: "visitor",

  initialParams: INITIAL_PARAMS,

  visitor: (params?: object) => {
    const {
      allowedEval,
      forcedConstant: CONSTANT,
      evalLists,
    } = {
      ...INITIAL_PARAMS,
      ...params,
    };

    interface MaybeValue {
      hasValue: boolean;
      value?: unknown;
    }

    // TODO: add a max recursion depth
    const getMaybeValue = (node: t.Node | null): MaybeValue => {
      const noValue = {
        hasValue: false,
      };

      if (!node) {
        return noValue;
      }

      if (
        t.isRegExpLiteral(node) ||
        t.isRegExpLiteral(node) ||
        t.isTemplateLiteral(node)
      ) {
        return noValue;
      }

      if (t.isIdentifier(node) && node.name === "undefined") {
        return { hasValue: true, value: undefined };
      }

      if (t.isIdentifier(node) && node.name === "String") {
        return { hasValue: true, value: String };
      }

      if (
        t.isIdentifier(node) &&
        (node.name === "window" || node.name === "self")
      ) {
        return { hasValue: true, value: self };
      }

      if (t.isNullLiteral(node)) {
        return {
          hasValue: true,
          value: null,
        };
      }

      if (t.isLiteral(node)) {
        return {
          hasValue: true,
          value: node.value,
        };
      }

      if (t.isArrayExpression(node) && evalLists) {
        if (node.elements.length === 0) {
          return {
            hasValue: true,
            value: [],
          };
        }

        const maybeElements = node.elements.map((e) => getMaybeValue(e));

        if (maybeElements.every((e) => e.hasValue)) {
          return {
            hasValue: true,
            value: maybeElements.map((e) => e.value),
          };
        }

        return { hasValue: false };
      }

      if (t.isUnaryExpression(node)) {
        const evalUnop = (operator: any): ((arg: any) => MaybeValue) => {
          switch (operator) {
            case "!":
              return (arg: any): MaybeValue => ({
                hasValue: true,
                value: !arg,
              });
            case "+":
              return (arg: any): MaybeValue => ({
                hasValue: true,
                value: +arg,
              });
            case "-":
              return (arg: any): MaybeValue => ({
                hasValue: true,
                value: -arg,
              });
            case "~":
              return (arg: any): MaybeValue => ({
                hasValue: true,
                value: ~arg,
              });
            default:
              return (): MaybeValue => ({ hasValue: false });
          }
        };

        const arg = getMaybeValue(node.argument);

        if (arg.hasValue) {
          return evalUnop(node.operator)(arg.value);
        }
        return noValue;
      }

      if (t.isBinary(node)) {
        const evalBinop = (
          operator: any
        ): ((left: any, right: any) => MaybeValue) => {
          switch (operator) {
            case "==":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                /* eslint-disable eqeqeq */
                value: left == right,
              });
            case "!=":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                /* eslint-disable eqeqeq */
                value: left != right,
              });
            case "===":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left === right,
              });
            case "!==":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left !== right,
              });
            case "<":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left < right,
              });
            case "<=":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left <= right,
              });
            case ">":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left > right,
              });
            case ">=":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left >= right,
              });
            case "<<":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left << right,
              });
            case ">>":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left >> right,
              });
            case ">>>":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left >>> right,
              });
            case "+":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left + right,
              });
            case "-":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left - right,
              });
            case "*":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left * right,
              });
            case "/":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left / right,
              });
            case "%":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left % right,
              });
            case "**":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left ** right,
              });
            case "|":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left | right,
              });
            case "^":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left ^ right,
              });
            case "&":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left & right,
              });
            case "&&":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left && right,
              });
            case "||":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left || right,
              });
            case "??":
              return (left: any, right: any): MaybeValue => ({
                hasValue: true,
                value: left ?? right,
              });
            default:
              return (): MaybeValue => ({ hasValue: false });
          }
        };

        const left = getMaybeValue(node.left);
        const right = getMaybeValue(node.right);

        if (left.hasValue && right.hasValue) {
          return evalBinop(node.operator)(left.value, right.value);
        }
        return noValue;
      }

      if (t.isMemberExpression(node)) {
        const object = getMaybeValue(node.object);
        const property = t.isIdentifier(node.property)
          ? { hasValue: true, value: node.property.name }
          : getMaybeValue(node.property);

        if (object.hasValue && property.hasValue) {
          try {
            return {
              hasValue: true,
              value: (object.value as any)[property.value as string],
            };
          } catch (_) {
            return noValue;
          }
        }
      }

      if (t.isCallExpression(node)) {
        const callee = t.isIdentifier(node.callee)
          ? {
              hasValue: allowedEval.indexOf(node.callee.name) > -1,
              value:
                allowedEval.indexOf(node.callee.name) > -1
                  ? /* eslint-disable no-eval */
                    safeEval(node.callee.name)
                  : null,
            }
          : getMaybeValue(node.callee);

        if (callee.hasValue) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          if (allowedEval.indexOf((callee.value as Function).name) === -1) {
            return noValue;
          }

          const maybeArguments = node.arguments.map((e) => getMaybeValue(e));

          // TODO: not clean
          if (t.isMemberExpression(node.callee)) {
            // this
            maybeArguments.unshift(getMaybeValue(node.callee.object));
          } else {
            maybeArguments.unshift({ hasValue: true, value: null });
          }

          if (maybeArguments.every((e) => e.hasValue)) {
            try {
              return {
                hasValue: true,
                value: (callee.value as any).call(
                  ...maybeArguments.map((e) => e.value)
                ),
              };
            } catch (_) {
              return noValue;
            }
          }
        }
      }

      return noValue;
    };

    const fromMaybeValue = (maybeValue: MaybeValue): t.Expression | null => {
      if (maybeValue.value === null) {
        return t.nullLiteral();
      }

      if (maybeValue.value === undefined) {
        return t.identifier("undefined");
      }

      if (typeof maybeValue.value === "string") {
        return t.stringLiteral(maybeValue.value);
      }

      if (typeof maybeValue.value === "boolean") {
        return t.booleanLiteral(maybeValue.value);
      }

      if (typeof maybeValue.value === "number") {
        return t.numericLiteral(maybeValue.value);
      }

      if (
        Object.prototype.toString.call(maybeValue.value) === "[object Array]"
      ) {
        const expressions: (t.Expression | null)[] = (maybeValue.value as any[])
          .map((v: unknown) => ({
            hasValue: true,
            value: v,
          }))
          .map(fromMaybeValue);

        if (expressions.every((e) => e !== null))
          return t.arrayExpression(expressions as t.Expression[]);
      }

      return null;
    };

    return {
      VariableDeclarator: (path) => {
        if (t.isIdentifier(path.node.id) && path.node.init) {
          const maybeValue = getMaybeValue(path.node.init);
          if (!maybeValue.hasValue) {
            return;
          }

          const literal = fromMaybeValue(maybeValue);

          if (!literal) {
            return;
          }

          path.scope.crawl();
          const binding = path.scope.getBinding(path.node.id.name);

          if (!binding) {
            return;
          }

          const { constant, referencePaths } = binding;

          if (!constant) {
            if (
              !path.node.leadingComments ||
              !path.node.leadingComments.some(
                (comment) => comment.value.indexOf(CONSTANT) >= 0
              )
            ) {
              return;
            }
          }

          for (const referencePath of referencePaths) {
            binding.scope.crawl();

            if (
              !referencePath ||
              !t.isIdentifier(referencePath.node, { name: path.node.id.name })
            ) {
              continue;
            }

            try {
              referencePath.replaceWith(literal);
            } catch (e) {
              console.error(`[CONSTANT FOLDING] [VAR] [ERROR] ${e}`);
              if (verbose > 1) {
                referencePath.addComment("leading", "[# ERROR #]");
              }
            }
          }

          if (verbose > 1) {
            path.addComment("leading", "[# REMOVED CONSTANT #]");
          }
          // TODO:
          // if (!keepConstants) {
          //   path.remove();
          // }
        }
      },

      LogicalExpression: (path) => {
        const { operator, left, right, loc } = path.node;

        const maybeLeft = getMaybeValue(left);
        const maybeRight = getMaybeValue(right);

        if (!maybeLeft.hasValue && !maybeRight.hasValue) {
          return;
        }

        switch (operator) {
          case "||":
            if (maybeLeft.hasValue) {
              if (maybeLeft.value) {
                path.replaceWith(left);
              } else {
                path.replaceWith(right);
              }
            }
            break;
          case "&&":
            if (maybeLeft.hasValue) {
              if (maybeLeft.value) {
                path.replaceWith(right);
              } else {
                path.replaceWith(left);
              }
            }
            break;
        }

        path.node.loc = loc;
      },

      enter: (path) => {
        let literal: t.Node | null;

        try {
          const maybeValue = getMaybeValue(path.node);

          if (
            t.isExpression(path.node) &&
            !t.isLogicalExpression(path.node) &&
            !t.isLiteral(path.node) &&
            !t.isIdentifier(path.node) &&
            !t.isArrayExpression(path.node) &&
            maybeValue.hasValue
          ) {
            literal = fromMaybeValue(maybeValue);

            if (literal !== null) {
              try {
                const { loc } = path.node;
                path.replaceWith(literal);
                path.node.loc = loc;

                if (verbose > 1) {
                  path.addComment("leading", "[# COLLAPSED CONSTANT #]");
                }
              } catch (e) {
                console.error(`[CONSTANT FOLDING] [EXP] [ERROR] ${e}`);
                if (verbose > 1) {
                  path.addComment("leading", "[# ERROR #]");
                }
              }
            }
          }
        } catch (e) {
          console.error(
            `[ERROR] [CONSTANT FOLDING] ${e} occurred while evaluating expression at node:`
          );
        }
      },
    };
  },
};
