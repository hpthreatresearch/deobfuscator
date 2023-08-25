// © Copyright 2023 HP Development Company, L.P.
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Badge, Form } from "react-bootstrap";
import type { LabeledArrayProps } from "./types";

/**
 * An input component for a string array
 */
export const LabeledArray = ({
  children,
  state: [state, setState],
}: LabeledArrayProps) => {
  /**
   * The value of the string in the text input
   */
  const [value, setValue] = useState("");

  /**
   * Handler for key press
   *
   * On `Enter`, add the value in the text input to the array and clears the text input
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      setState((s) => [...s, value]);
      setValue("");
    }
  };

  /**
   * Handler for cross on items
   *
   * Removes element at `index` from the array
   */
  const handleRemove = (index: number) => () => {
    setState((s) => {
      s.splice(index, 1);
      return [...s];
    });
  };

  return (
    <div>
      <div className="labeled-input">
        <div>{children}</div>
        <Form.Control
          className="ms-auto monospace"
          value={value}
          onChange={(e) => setValue(e.target.value as string)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="d-flex flex-row mt-2 mb-2 flex-wrap">
        {state.map((value, index) => (
          <Badge pill className="m-1" key={index}>
            {value}{" "}
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="cursor-pointer"
              onClick={handleRemove(index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
