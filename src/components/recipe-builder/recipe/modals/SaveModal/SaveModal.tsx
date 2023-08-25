// © Copyright 2023 HP Development Company, L.P.
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocalRecipes } from "../utils";
import type { SaveModalProps } from "./types";
/**
 * A component rendered inside a modal to save recipes to local storage
 */
export const SaveModal = ({ handleClose, cards }: SaveModalProps) => {
  /**
   * The recipes saved in local storage
   */
  const [localRecipes, setLocalRecipes] = useLocalRecipes();

  /**
   * The name that the recipe will be saved under
   * If another recipe already has that nam, it will be overwritten
   */
  const [name, setName] = useState("");

  /**
   * The JSON stringified version of the current recipe
   */
  const [parsed, setParsed] = useState("");

  /**
   * Stringify the current card selection
   */
  useEffect(() => {
    setParsed(JSON.stringify(cards.map((c) => c.module)));
  }, [cards]);

  /**
   * Handler for the `Save` button.
   *
   * Saves the recipe in the localStorage under `savedRecipes.<recipe name>` then closes the modal
   * `name` must be at least 1 character long
   */
  const handleSave = useCallback(() => {
    // TODO: Add user feedback
    if (name === "") return;

    // TODO: Add a warning message if attempt to override
    if (name in localRecipes) {
      /* empty */
    }

    setLocalRecipes((curr) => ({ ...curr, [name]: parsed }));
    handleClose();
  }, [handleClose, localRecipes, name, parsed, setLocalRecipes]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName]
  );

  const handleParsedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setParsed(e.target.value);
    },
    [setParsed]
  );

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Save</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="modalFormParsed">
          <Form.Label>JSON</Form.Label>
          <Form.Control
            onChange={handleParsedChange}
            as="textarea"
            rows={3}
            value={parsed}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="modalFormName">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={handleNameChange} as="input" value={name} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave} disabled={name === ""}>
          Save
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Done
        </Button>
      </Modal.Footer>
    </>
  );
};
