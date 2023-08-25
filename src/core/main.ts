// © Copyright 2023 HP Development Company, L.P.
import type { GeneratorResult } from "@babel/generator";
import generator from "@babel/generator";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import type * as t from "@babel/types";
import type { DeobfuscatorModuleWithParam } from "./types";

export function parse(src: string): t.Node {
  return parser.parse(src);
}

/**
 * Runs `step` modules on an AST
 * @param ast the mutated AST
 * @param modules a list of modules to run - if there are more modules than steps, not all modules will be run
 * @param steps the maximum amount of steps to run, if there are less modules than steps returns
 * @returns The amount of steps run
 */
export function runModules(
  ast: t.Node,
  modules: DeobfuscatorModuleWithParam[],
  steps: number,
  callback: (step: number) => void
): number {
  let step = 0;

  for (const { module, params } of modules) {
    let stepSize: number;
    switch (module.kind) {
      case "visitor":
        traverse(ast, module.visitor(params));
        stepSize = 1;
        break;
      case "controlFlow":
        stepSize = module.operation(
          ast,
          steps + 1 - step,
          (s) => callback(s + step),
          params
        ); // + 1 because it can run one op
        break;
    }

    // IMPORTANT
    (traverse as any).cache.clear();

    // Stepping logic
    if (step + stepSize > steps) {
      params.isNextStep = true;
      return step;
    }

    step += stepSize;

    callback(step);
  }

  return step;
}

export function generate(
  ast: t.Node,
  obfCode: string
): {
  code: string;
  map: GeneratorResult["map"];
} {
  const generated = generator(
    ast,
    { sourceMaps: true, sourceFileName: "obfuscated.js" },
    obfCode
  );
  return { code: generated.code, map: generated.map };
}
