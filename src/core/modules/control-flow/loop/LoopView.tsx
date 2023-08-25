// © Copyright 2023 HP Development Company, L.P.
import { DropArea } from "@components/dragging/DropArea/DropArea";
import { LabeledNumericInput } from "@components/modules/params";
import type {
  Item,
  ModuleComponentPropType,
  ModuleComponentType,
  ModuleWithID,
} from "@core/types";
import { getNewUUID } from "@core/utils";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";

// export interface LoopViewPropType extends ModuleComponentPropType {
//   setParams: (params: SupportedParams) => void;
//   item: {
//     name: MODULE_NAMES;
//     params: LoopParams;
//     elevation: number;
//   };
// }

export const LoopView: ModuleComponentType = ({
  setParams,
  item: { params, elevation },
}: ModuleComponentPropType) => {
  const childElevation = elevation + 1;

  const [cards, _setCards] = useState<ModuleWithID[]>([]);

  const [iterations, _setIterations] = useState(1);

  const setCards = (action: SetStateAction<ModuleWithID[]>) => {
    let newCards: ModuleWithID[];

    if (action instanceof Function) {
      newCards = action(cards);
    } else {
      newCards = action;
    }
    setParams({
      ...params,
      modules: newCards.map((card) => card.module),
    });

    _setCards(action);
  };

  const setIterations = (action: SetStateAction<number>) => {
    let newIterations: number;

    if (action instanceof Function) {
      newIterations = action(iterations);
    } else {
      newIterations = action;
    }
    setParams({
      ...params,
      steps: 0, // Reset steps if the loop changes
      iterations: newIterations,
    });
    _setIterations(newIterations);
  };

  useEffect(() => {
    if (params.modules && params.iterations) {
      _setCards(
        (params.modules as Item[]).map((module: Item) => ({
          module,
          id: getNewUUID(),
          elevation: childElevation,
        }))
      );
      _setIterations(params.iterations as number);
    } else {
      setParams({
        steps: 0, // Reset steps if the loop changes
        modules: cards.map((card) => card.module),
        iterations,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="module">
      <div className="mb-3">Loop</div>
      <div className="mb-3">
        <LabeledNumericInput state={[iterations, setIterations]}>
          Iterations
        </LabeledNumericInput>
      </div>
      <DropArea
        cardsState={[cards, setCards]}
        steps={params.steps as number}
        className="loop-container"
        elevation={childElevation}
      />
    </div>
  );
};
