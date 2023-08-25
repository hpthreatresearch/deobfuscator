// © Copyright 2023 HP Development Company, L.P.
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { v4 as uuidv4 } from "uuid";
import type { UUID } from "./types";

/**
 * A utility for abstracting id logic
 *
 * currently using uuid module
 */
export const getNewUUID = (): UUID => {
  return uuidv4() as UUID;
};

/**
 * A closure to set eval's context
 */
export const safeEval = (str: string) => {
  return function (str: string) {
    const e = eval;
    return e(str);
  }.call({}, str);
};

/**
 * A closure to set Function's context
 */
export const safeFunction = (...args: string[]) => {
  return function (...args: string[]) {
    return Function(...args);
  }.call({}, ...args);
};

/**
 * `path.replaceWith` wrapped to save the previous node's location
 */
export const replaceKeepLocation = (
  path: NodePath<t.Node>,
  newNode: t.Node
) => {
  const { loc } = path.node;
  path.replaceWith(newNode);
  path.node.loc = loc;
};

/**
 * Tries to replace a node.
 * Check if the container is falsy, if so returns false
 */
export const safeReplace = (
  path: NodePath<t.Node>,
  newNode: t.Node
): boolean => {
  try {
    replaceKeepLocation(path, newNode);
    return true;
  } catch (e) {
    console.error(e);
    /* empty */
  }

  return false;
};

/**
 * PROTOTYPE
 *
 * DOUBLE AST VISITOR
 */

/**
 * A visitor to compare two ASTs.
 *
 * ⚠ Do not mutate the ASTs, undefined behavior
 */
export type NodeComparator = (
  model: t.Node, // TODO: define
  test: t.Node, // TODO: define
  state?: any // TODO: define
) => boolean | undefined;

export type NodeComparatorOperator = (
  ...args: NodeComparator[]
) => NodeComparator;

/**
 * A model NodeComparator. It verifies that both trees have the same structure.
 */
export const NC_STRUCTURE: NodeComparator = <P extends t.Node>(
  model: P,
  test: t.Node
): test is P => model.type === test.type;

/**
 * A model NodeComparator. It verifies that in both trees any identifiers are equal, use with NC_TYPES
 */
export const NC_IDENTIFIERS: NodeComparator = (model, test) =>
  !t.isIdentifier(model) || model.name === (test as t.Identifier).name;

/**
 * A model NodeComparator. It verifies that in both trees any literals are equal, use with NC_TYPES
 *
 * @todo Add support for `RegExpLiteral` and `TemplateLiteral`
 */
export const NC_LITERALS: NodeComparator = (model, test) => {
  if (!t.isLiteral(model)) return true;

  if (t.isNullLiteral(model)) return true;

  // TODO: unsupported
  if (t.isRegExpLiteral(model) || t.isTemplateLiteral(model)) return true;

  return model.value === (test as any).value;
};

/**
 * A `NodeComparator` built by returning the lazy or of its arguments
 */
export const NC_OR: NodeComparatorOperator =
  (...ncs) =>
  (...args) => {
    for (const nc of ncs) {
      if (nc(...args)) return true;
    }
    return false;
  };

/**
 * A `NodeComparator` built by returning the lazy and of its arguments
 */
export const NC_AND: NodeComparatorOperator =
  (...ncs) =>
  (...args) => {
    for (const nc of ncs) {
      if (!nc(...args)) return false;
    }
    return true;
  };

/**
 * Visits 2 nodes recursively with a shared visitor.
 * This is useful for comparing structures.
 *
 * ⚠ An error will probably be thrown if you do not check that the structures are similar in your visitor
 *
 * @param modelNode The first node, if it is falsy `compareTrees` will return true
 * @param testNode  The second node
 * @param comparingVisitor A visitor that is given both nodes as well as the state. If it returns false, `compareTrees` will stop and return false;
 * @param state A mutable state that will be passed to the visitor
 * @returns True if `modelNode` gets traversed without `comparingVisitor` ever returning false
 */
export const compareTrees = (
  modelNode: t.Node,
  testNode: t.Node,
  comparingVisitor: NodeComparator,
  state?: object
): boolean => {
  if (!modelNode) return true;

  if (!comparingVisitor(modelNode, testNode, state)) {
    return false;
  }

  const keys = t.VISITOR_KEYS[modelNode.type];
  for (const key of keys) {
    // @ts-expect-error key is from visitor keys
    const modelChild = modelNode[key] as t.Node | t.Node[] | null;

    // @ts-expect-error key is from visitor keys
    const testChild = testNode[key] as t.Node | t.Node[] | null;

    if (!modelChild) continue;

    if (!testChild) return false;

    if (Array.isArray(modelChild)) {
      if (!Array.isArray(testChild) || testChild.length < modelChild.length) {
        return false;
      }

      for (let i = 0; i < modelChild.length; i++) {
        if (
          !compareTrees(modelChild[i], testChild[i], comparingVisitor, state)
        ) {
          return false;
        }
      }
    } else {
      if (
        !compareTrees(modelChild, testChild as t.Node, comparingVisitor, state)
      ) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Runs a function on every reference path of a given name at a parent's scope
 */
export const forEachReference = (
  path: NodePath<t.Node>,
  name: string,
  callbackfn: (referencePath: NodePath<t.Node>) => void,
  assertConstant = true
) => {
  path.scope.crawl();
  const binding = path.scope.getBinding(name);

  // sanity check
  if (!binding) {
    return;
  }

  const { constant, referencePaths } = binding;

  if (assertConstant && !constant) {
    return;
  }

  for (const referencePath of referencePaths) {
    path.scope.crawl();

    callbackfn(referencePath);
  }
};
