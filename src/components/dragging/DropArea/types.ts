// © Copyright 2023 HP Development Company, L.P.
import type { MODULE_NAMES } from "@core/config";
import type { ModuleWithID } from "@core/types";

export interface DropAreaProps {
  cardsState: [
    ModuleWithID[],
    React.Dispatch<React.SetStateAction<ModuleWithID[]>>
  ];
  steps: number;
  className?: string;
  elevation?: number; // WIP
}

export interface DropCollected {
  placeHolderName: MODULE_NAMES | undefined;
}
