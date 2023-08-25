// © Copyright 2023 HP Development Company, L.P.
import { MODULES } from "@core/config/modules";
import { useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { BaseModule } from "../../modules/BaseModule";
import type { Collected } from "../item-types";
import { ItemTypes } from "../item-types";
import type { CardProps, DragItem } from "./types";

export const Card = ({
  id,
  module,
  moveCard,
  removeCard,
  findCard,
  setParams,
  style,
}: CardProps) => {
  const ModuleComponent = useMemo(
    () => MODULES[module.name].ModuleComponent || BaseModule,
    [module]
  );
  const originalIndex = findCard(id).index;

  /**
   * react-dnd
   */
  const [{ isDragging }, drag] = useDrag<DragItem, null, Collected>(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex, module },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      /**
       * If could not drop, remove the item
       */
      end: (item, monitor) => {
        const { id: droppedId } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          removeCard(droppedId);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  /**
   * react-dnd
   *
   * On hover, place card hovered card above this one
   */
  const [, drop] = useDrop<DragItem, null, null>(
    () => ({
      accept: ItemTypes.CARD,
      hover(
        { id: draggedId, module: { elevation: draggedElevation } },
        monitor
      ) {
        if (!monitor.isOver({ shallow: true })) return;

        if (module.elevation === draggedElevation) {
          if (draggedId !== id) {
            const { index: myIndex } = findCard(id);
            moveCard(draggedId, myIndex);
          }
        }
      },
    }),
    [findCard, moveCard]
  );

  /**
   * Reduce opacity when dragging
   */
  const opacity = isDragging ? 0.25 : 1;

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      style={{ opacity, marginBottom: "12px", ...style }}
      className={
        "isNext" in module.params && module.params.isNext
          ? "next-module"
          : "border-white"
      }
    >
      <ModuleComponent setParams={setParams} item={module} />
    </div>
  );
};
