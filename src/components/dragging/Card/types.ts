// © Copyright 2023 HP Development Company, L.P.
import type { Item, UUID } from "@core/types";

export interface CardProps {
  id: UUID;
  module: Item;
  moveCard: (id: UUID, to: number) => void;
  removeCard: (id: UUID) => void;
  findCard: (id: UUID) => { index: number };
  setParams: (params: object) => void;
  style?: React.CSSProperties;
}

export interface DragItem {
  id: UUID;
  originalIndex: number;
  module: Item;
}
