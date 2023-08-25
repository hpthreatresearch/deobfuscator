// © Copyright 2023 HP Development Company, L.P.
import { Form } from "react-bootstrap";

export interface LabeledCheckboxProps {
  children: string; // The display name of the input
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

/**
 * An input component for a boolean value
 */
export const LabeledCheckbox = ({
  children,
  state: [state, setState],
}: LabeledCheckboxProps) => {
  return (
    <div className="labeled-checkbox">
      <div>{children}</div>
      <Form.Check
        className="ms-auto"
        type="checkbox"
        checked={state}
        onChange={(e) => setState(e.target.checked)}
      />
    </div>
  );
};
