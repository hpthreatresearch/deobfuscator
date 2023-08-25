// © Copyright 2023 HP Development Company, L.P.
import { MODULE_NAMES } from "@core/config/module-names";
import { MODULES } from "@core/config/modules";
import type { LoopParams } from "@core/modules/control-flow/loop/loop";
import type { DeobfuscatorModule, Item, ParamType } from "@core/types";

/**
 * How many steps are required to run this module
 */
export const getMaxStepsModule = (
  module: DeobfuscatorModule,
  params?: ParamType
): number => {
  switch (module.kind) {
    case "visitor":
      return 1;
    case "controlFlow":
      return module.steps(params);
  }
};

/**
 * How many maximum steps are required to evaluate this item
 */
export const getMaxSteps = ({ name, params }: Item): number =>
  getMaxStepsModule(MODULES[name], params);

/**
 * How many steps should are required to evaluate every item
 */
export const numberOfSteps = (items: Item[]) =>
  items.map(getMaxSteps).reduce((x, y) => x + y, 0);

const clearNextTag = (item: Item) => {
  "isNext" in item.params && delete item.params.isNext;

  if (item.name === MODULE_NAMES.LOOP) {
    (item.params as unknown as LoopParams).steps = 0;
    (item.params as unknown as LoopParams).modules.forEach(clearNextTag);
  }
};

export const tagNextCard = (steps: number, items: Item[]) => {
  let step = 0;

  items.forEach(clearNextTag);

  for (const item of items) {
    const stepSize = getMaxSteps(item);
    step += stepSize;
    if (step > steps) {
      item.params.isNext = true;

      if (item.name === MODULE_NAMES.LOOP) {
        const remainingSteps = steps - step + stepSize;
        (item.params as unknown as LoopParams).steps = remainingSteps;
        tagNextCard(
          remainingSteps %
            (item.params as unknown as LoopParams).modules.length,
          (item.params as unknown as LoopParams).modules
        );
      }
      break;
    }
  }
};
