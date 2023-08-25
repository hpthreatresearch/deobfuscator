// © Copyright 2023 HP Development Company, L.P.
import type { Item } from "@core/types";
import { getNewUUID } from "@core/utils";
import { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { OpenModalProps } from "./types";
import { useLocalRecipes } from "../utils";
import type { RecipeBook } from "../types";

/**
 * A component rendered inside a modal to open a recipes from local storage
 * or from a JSON
 */
export const OpenModal = ({ handleClose, setCards }: OpenModalProps) => {
  /**
   * The recipes saved in local storage
   */
  const [localRecipes, setLocalRecipes] = useLocalRecipes();

  /**
   * The names of all saved recipes
   */
  const keys = Object.keys(localRecipes);

  /**
   * The name of the selected local recipe
   */
  const [selectedKey, setSelectedKey] = useState<string>("");

  /**
   * The stringified recipe either from local storage or submitted by the user
   */
  const [parsed, setParsed] = useState<string>("");

  /**
   * Selects an recipe form a list of available recipes.
   *
   * If no recipe is available, set the `parsed` and `selectedKey` to ""
   */
  const selectFirstItem = useCallback(
    (recipeBook: RecipeBook) => {
      const localKeys = Object.keys(recipeBook);

      if (localKeys.length > 0) {
        setSelectedKey(localKeys[0]);
        setParsed(recipeBook[localKeys[0]]);
      } else {
        setSelectedKey("");
        setParsed("");
      }
    },
    [setSelectedKey, setParsed]
  );

  /**
   * On load, select the first item
   */
  useEffect(() => {
    selectFirstItem(localRecipes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handler for the `Open` button.
   *
   * Parses `parsed` and sets `Recipe`'s cards to the result
   *
   * TODO:
   *  - check if `parsed` is valid
   */
  const handleOpen = useCallback(() => {
    const items: Item[] = JSON.parse(parsed);
    setCards(items.map((item) => ({ module: item, id: getNewUUID() })));
    handleClose();
  }, [handleClose, parsed, setCards]);

  /**
   * Handler for the `Remove` button.
   *
   * Removes the `selectedKey` recipe from local storage.
   */
  const handleRemove = useCallback(() => {
    if (selectedKey === "") return;

    delete localRecipes[selectedKey];

    setLocalRecipes({ ...localRecipes });
    selectFirstItem(localRecipes);
  }, [selectedKey, localRecipes, setLocalRecipes, selectFirstItem]);

  /**
   * Handler for when the user selects another recipe
   */
  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedKey(event.target.value);
      setParsed(localRecipes[event.target.value]);
    },
    [setSelectedKey, setParsed, localRecipes]
  );

  /**
   * Handler for when the user modifies the parsed field
   */
  const handleTextAreaChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setParsed(event.target.value as string);
    },
    [setParsed]
  );

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Open</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Name</h5>
        <Form.Select onChange={handleSelectChange}>
          {keys.map((key, idx) => (
            <option key={idx} value={key}>
              {key}
            </option>
          ))}
        </Form.Select>
        <h5 className="mt-5">JSON</h5>
        <Form.Control
          onChange={handleTextAreaChange}
          as="textarea"
          rows={3}
          value={parsed}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleOpen} disabled={parsed === ""}>
          Open
        </Button>
        <Button
          variant="danger"
          onClick={handleRemove}
          disabled={selectedKey === ""}
        >
          Remove
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Done
        </Button>
      </Modal.Footer>
    </>
  );
};
