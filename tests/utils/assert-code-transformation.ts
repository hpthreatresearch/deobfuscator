// © Copyright 2023 HP Development Company, L.P.
import generate from "@babel/generator";
import { parse } from "@babel/parser";
import type { TraverseOptions } from "@babel/traverse";
import traverse from "@babel/traverse";
import type * as t from "@babel/types";

export const assertCodeTransformation = (
  input: string,
  output: string,
  visitor: TraverseOptions<t.Node>
) => {
  const inputAst = parse(input);
  const outputAst = parse(output);

  traverse(inputAst, visitor);

  expect(generate(inputAst).code).toBe(generate(outputAst).code);
};
