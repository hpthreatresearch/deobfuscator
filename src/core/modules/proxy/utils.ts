// © Copyright 2023 HP Development Company, L.P.
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

type Unsupported = [undefined, undefined, undefined];

export type ProxyFunction = [string, t.Identifier[], t.Expression];

/**
 * type guard
 */
const isExpressionArray = (
  nodes: (object | null | undefined)[]
): nodes is t.Expression[] => nodes.every((node) => t.isExpression(node));

/**
 * type guard
 */
const isIdentifierArray = (
  nodes: (object | null | undefined)[]
): nodes is t.Identifier[] => nodes.every((node) => t.isIdentifier(node));

const getFunctionName = (node: t.Function): string | undefined => {
  switch (node.type) {
    case "FunctionDeclaration":
      return node.id?.name;
    case "FunctionExpression":
      return node.id?.name;
    case "ArrowFunctionExpression":
      return undefined;
    case "ObjectMethod":
      return (
        (t.isIdentifier(node.key) && node.key.name) ||
        (t.isStringLiteral(node.key) && node.key.value) ||
        undefined
      );
    case "ClassMethod":
      return (
        (t.isIdentifier(node.key) && node.key.name) ||
        (t.isStringLiteral(node.key) && node.key.value) ||
        undefined
      );
    case "ClassPrivateMethod":
      // TODO: add support
      return undefined;
  }
};

/**
 * Extracts a name, parameters and a return expression from a function
 */
export const saveProxyFunction = (
  node: t.Function,
  name?: string
): ProxyFunction | Unsupported => {
  const unsupported: Unsupported = [undefined, undefined, undefined];
  name = name || getFunctionName(node);
  if (name === undefined) return unsupported;

  let returnExpression: t.Expression | undefined | null;
  if (t.isBlockStatement(node.body)) {
    if (node.body.body.length !== 1 || !t.isReturnStatement(node.body.body[0]))
      return unsupported;

    returnExpression = node.body.body[0].argument;
  } else {
    returnExpression = node.body;
  }

  if (!returnExpression) return unsupported;

  if (!isIdentifierArray(node.params)) return unsupported;

  return [name, node.params, returnExpression];
};

/**
 * Finds the index of an argument in a list of parameters
 */
export const getArgIdx = (params: t.Identifier[], node: t.Identifier) =>
  params.findIndex((param) => param.name === node.name);

/**
 * Returns a node to replace the call expression with
 */
export const replaceProxyFunctionCall = (
  [, params, returnExpression]: ProxyFunction,
  node: t.CallExpression
): t.Expression | null => {
  if (!isExpressionArray(node.arguments)) {
    return null;
  }

  const _arguments = node.arguments;

  if (_arguments.length < params.length) {
    return null;
  }

  const ret = t.cloneDeepWithoutLoc(returnExpression);

  traverse(ret, {
    noScope: true,
    Identifier: (path) => {
      const idx = getArgIdx(params, path.node);
      if (idx > -1) {
        path.replaceWith(t.cloneDeepWithoutLoc(_arguments[idx]));
        path.shouldSkip = true;
      }
    },
  });

  return ret;
};

/**
 * saves an object properties into the proper map
 */
export const saveProperties = (
  properties: (t.ObjectMethod | t.ObjectProperty | t.SpreadElement)[]
): [Map<string, t.Expression>, Map<string, ProxyFunction>] => {
  const proxyFunctions = new Map<string, ProxyFunction>();
  const proxyValues = new Map<string, t.Expression>();

  for (const prop of properties) {
    switch (prop.type) {
      case "ObjectMethod": {
        const proxyFunction = saveProxyFunction(prop);
        if (proxyFunction[0] === undefined) continue;

        proxyFunctions.set(proxyFunction[0], proxyFunction);
        break;
      }
      case "ObjectProperty": {
        if (!(t.isStringLiteral(prop.key) || t.isIdentifier(prop.key))) break;

        const key = t.isLiteral(prop.key) ? prop.key.value : prop.key.name;

        if (t.isFunction(prop.value)) {
          const proxyFunction = saveProxyFunction(prop.value, key);
          if (proxyFunction[0] === undefined) continue;

          proxyFunctions.set(proxyFunction[0], proxyFunction);
          break;
        }

        if (!t.isExpression(prop.value)) break;

        proxyValues.set(key, prop.value);
        break;
      }
      case "SpreadElement":
        /* unsupported */
        break;
    }
  }
  return [proxyValues, proxyFunctions];
};
