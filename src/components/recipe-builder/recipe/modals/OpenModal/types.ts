// © Copyright 2023 HP Development Company, L.P.
import type { ModuleWithID } from "@core/types";
import type { BaseModalProps } from "../types";

/**
 * Props for the OpenModal component
 */
export interface OpenModalProps extends BaseModalProps {
  /**
   *  Access to the `cardState` of the `Recipe` component
   */
  setCards: React.Dispatch<React.SetStateAction<ModuleWithID[]>>;
}
