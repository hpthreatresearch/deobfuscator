// © Copyright 2023 HP Development Company, L.P.
import { MODULES } from "@core/config";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { useDrag } from "react-dnd";
import type { Collected, NewCardItem } from "../item-types";
import { ItemTypes } from "../item-types";
import type { SpawnCardProps } from "./types";

/**
 * A card from the module library that can be added to the current recipe
 */
export const SpawnCard = ({ name, openDocumentation }: SpawnCardProps) => {
  /**
   * The documentation of the module
   */
  const { documentation } = useMemo(() => MODULES[name], [name]);

  /**
   * Dragging logic
   */
  const [{ isDragging }, drag] = useDrag<NewCardItem, null, Collected>(
    () => ({
      type: ItemTypes.NEW_CARD,
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [name]
  );

  /**
   * Reduce opacity when dragging
   */
  const opacity = isDragging ? 0.75 : 1;

  return (
    <div ref={(node) => drag(node)} style={{ opacity }} className="spawn-card">
      {name}
      <div className="icon">
        {documentation && (
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => openDocumentation(name)}
          />
        )}
      </div>
    </div>
  );
};
