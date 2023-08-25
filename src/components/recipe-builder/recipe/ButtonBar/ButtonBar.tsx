// © Copyright 2023 HP Development Company, L.P.
import { faCake } from "@fortawesome/free-solid-svg-icons";
import type { ButtonBarProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

/**
 * A component to render the buttons under the drop area
 */
export const ButtonBar = ({
  loading,
  handleStep,
  handleBake,
}: ButtonBarProps) => {
  return (
    <div className="button-bar">
      <Button className="mx-3" onClick={handleStep} disabled={loading}>
        Step
      </Button>

      <Button
        className="flex-grow-1 mx-3"
        onClick={handleBake}
        disabled={loading}
      >
        <FontAwesomeIcon icon={faCake} style={{ marginRight: "10px" }} />
        Bake
      </Button>
    </div>
  );
};
