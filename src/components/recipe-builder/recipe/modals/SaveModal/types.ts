// © Copyright 2023 HP Development Company, L.P.
import type { ModuleWithID } from "@core/types";
import type { BaseModalProps } from "../types";

/**
 * Props for the SaveModal component
 */
export interface SaveModalProps extends BaseModalProps {
  /**
   * The list of current cards in the recipe
   */
  cards: ModuleWithID[];
}
