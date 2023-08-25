// © Copyright 2023 HP Development Company, L.P.
import type { DeobfuscatorModuleWithParam } from "@core/types";
import { convertMapping } from "../../mappings/utils";
import { MODULES } from "../config/modules";
import { generate, parse, runModules } from "../main";
import { numberOfSteps } from "./steps";
import type {
  BakerError,
  BakerIn,
  BakerProgress,
  BakerSuccess,
  Typeless,
} from "./types";

/**
 * The logic for the baker
 */
export const handleBakerMessage =
  (
    postSuccess: (msg: Typeless<BakerSuccess>) => void,
    postError: (msg: Typeless<BakerError>) => void,
    postProgress: (msg: Typeless<BakerProgress>) => void
  ) =>
  (ev: MessageEvent<BakerIn>) => {
    const { obfCode, items } = ev.data;

    const maxSteps = numberOfSteps(items);
    const steps: number =
      ev.data.steps === undefined ? maxSteps - 1 : ev.data.steps;

    try {
      const ast = parse(obfCode);

      const modules: DeobfuscatorModuleWithParam[] = [];

      for (const { name, params } of items) {
        modules.push({ module: MODULES[name], params });
      }

      if (steps < maxSteps) {
        runModules(ast, modules, steps, (s) => {
          postProgress({ progress: s / steps });
          console.log("PROGRESS", s, steps);
        });
      }

      const { code, map } = generate(ast, obfCode);

      let mappings: number[][] = [];

      if (map) {
        mappings = convertMapping(map.mappings);
      }

      postSuccess({
        code,
        mappings,
        steps: (steps + 1) % (maxSteps + 1),
      });
    } catch (error) {
      postError({
        error,
      });
    }
  };
