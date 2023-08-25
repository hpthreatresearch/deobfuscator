// © Copyright 2023 HP Development Company, L.P.
import type * as t from "@babel/types";
import { MODULES } from "@core/config/modules";
import { runModules } from "@core/main";
import type { ControlFlowModule, Item, ParamType } from "@core/types";
import { LoopView } from "./LoopView";

export interface LoopParams extends ParamType {
  modules: Item[];
  iterations: number;
  steps: number;
}

export const loop: ControlFlowModule = {
  kind: "controlFlow",
  ModuleComponent: LoopView,
  steps: (params) =>
    params
      ? (params as LoopParams).iterations *
        (params as LoopParams).modules.length
      : 0,
  operation: (ast: t.Node, steps: number, callback, params) => {
    const modules: Item[] = (params as LoopParams).modules;
    const iterations: number = (params as LoopParams).iterations;
    let step = 0;

    for (let i = 0; i < iterations; i++) {
      step += runModules(
        ast,
        modules.map(({ name, params }) => ({ module: MODULES[name], params })),
        steps - step,
        (s) => callback(s + step)
      );
    }

    return step;
  },
};
