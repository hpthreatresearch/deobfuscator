// © Copyright 2023 HP Development Company, L.P.
import type { MODULE_NAMES } from "@core/config";

export enum ItemTypes {
  CARD = "card",
  NEW_CARD = "new card",
}

export interface NewCardItem {
  name: MODULE_NAMES;
}

export interface CardItem {
  name: MODULE_NAMES;
}
/**
 * Interface for react-dnd
 */

export interface Collected {
  isDragging: boolean;
}
