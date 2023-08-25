// © Copyright 2023 HP Development Company, L.P.
import { useCallback } from "react";
import { useDrop } from "react-dnd";

import type { MODULE_NAMES } from "@core/config";
import type { UUID } from "@core/types";
import { getNewUUID } from "@core/utils";
import { Card } from "../Card/Card";
import type { CardItem, NewCardItem } from "../item-types";
import { ItemTypes } from "../item-types";
import type { DropAreaProps, DropCollected } from "./types";

/**
 * An area where cards can be dropped and reorganized
 *
 * TODO:
 *  - add an elevation system to support dragging to and from loops
 *  - Ability to drag to middle of list
 */
export const DropArea = (props: DropAreaProps) => {
  /**
   * WIP: The elevation of the drop area
   *
   * Useful for dragging from one elevation to another
   */
  const elevation = props.elevation || 0;

  /**
   * State containing all the cards currently in this area
   */
  const [cards, setCards] = props.cardsState;

  /**
   * Finds a card and it's index based on it's id
   */
  const findCard = useCallback(
    (id: UUID) => {
      const optionalCard = cards.filter((c) => `${c.id}` === id);
      const card = optionalCard[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  /**
   * Move a card with id `id` to index `newIndex`
   */
  const moveCard = (id: UUID, newIndex: number) => {
    const { index } = findCard(id);
    setCards((cards) => {
      /**
       * This is important in case the state is set twice.
       */
      const new_cards = [...cards];
      new_cards.splice(newIndex, 0, new_cards.splice(index, 1)[0]);
      return [...new_cards];
    });
  };

  /**
   * Removes a card with id `id`
   */
  const removeCard = (id: UUID) => {
    const { index } = findCard(id);
    setCards((cards) => [...cards.slice(0, index), ...cards.slice(index + 1)]);
  };

  /**
   * Returns a function to modify the params of the card with id `id`
   */
  const setParams = useCallback(
    (id: UUID) => (params: object) => {
      const { card, index } = findCard(id);
      card.module.params = { ...card.module.params, ...params };
      setCards((cards) => [
        ...cards.slice(0, index),
        card,
        ...cards.slice(index + 1),
      ]);
    },
    [findCard, setCards]
  );

  /**
   * Drop logic for react-dnd
   */
  const [{ placeHolderName }, drop] = useDrop<
    CardItem | NewCardItem,
    unknown,
    DropCollected
  >(() => ({
    accept: [ItemTypes.NEW_CARD, ItemTypes.CARD],

    /**
     * Gets the NEW_CARD's name to display at the bottom of the drop area
     */
    collect: (monitor) => {
      if (monitor.isOver({ shallow: true })) {
        const item = monitor.getItem();
        const placeHolderName: MODULE_NAMES = item.name;
        return {
          placeHolderName,
        };
      }
      return {
        placeHolderName: undefined,
      };
    },

    /**
     * Adds the
     */
    drop: (item, monitor) => {
      if (
        monitor.getItemType() === ItemTypes.NEW_CARD &&
        monitor.isOver({ shallow: true }) &&
        !monitor.didDrop()
      ) {
        const moduleName: MODULE_NAMES = item.name;
        setCards((cards) => [
          ...cards,
          {
            id: getNewUUID(),
            module: {
              params: {},
              name: moduleName,
              elevation,
            },
          },
        ]);
        return {};
      }
    },
  }));

  return (
    <div
      ref={drop}
      className={props.className || "p-2 mb-2 overflow-auto mh-100 h-100"}
    >
      {cards.map((card, idx) => (
        <Card
          key={card.id + idx}
          id={card.id}
          module={card.module}
          moveCard={moveCard}
          removeCard={removeCard}
          findCard={findCard}
          setParams={setParams(card.id)}
        />
      ))}

      {placeHolderName && (
        <div className="base-module" style={{ opacity: 0.25 }}>
          <div className="base-module-title">{placeHolderName}</div>
        </div>
      )}
    </div>
  );
};
