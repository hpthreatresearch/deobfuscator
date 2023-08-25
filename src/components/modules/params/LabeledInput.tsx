// © Copyright 2023 HP Development Company, L.P.
import { Form } from "react-bootstrap";

export interface LabeledInputProps<T> {
  children: string; // The display name of the input
  state: [T, React.Dispatch<React.SetStateAction<T>>];
}

/**
 * An input component for a string
 */
export const LabeledInput = ({
  children,
  state: [state, setState],
}: LabeledInputProps<string>) => {
  return (
    <div className="labeled-input">
      <div>{children}</div>
      <Form.Control
        className="ms-auto monospace"
        value={state}
        onChange={(e) => setState(e.target.value as string)}
      />
    </div>
  );
};

/**
 * An input component for a number
 */
export const LabeledNumericInput = ({
  children,
  state: [state, setState],
}: LabeledInputProps<number>) => {
  return (
    <div className="labeled-input">
      <div>{children}</div>
      <Form.Control
        className="ms-auto monospace"
        value={state}
        onChange={(e) => setState(parseInt(e.target.value as string))}
        type="number"
      />
    </div>
  );
};
