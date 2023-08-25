// © Copyright 2023 HP Development Company, L.P.
import { SandBoxEditor } from "@components/editors/SandboxEditor/SandboxEditor";
import { Col } from "react-bootstrap";
import { SandboxOutput } from "../SandboxOutput";
import { useMemo, useState } from "react";

/**
 * A sandbox to experiment with JavaScript
 */
export const Sandbox = () => {
  /**
   * The strings printed to the console by console.log
   */
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  /**
   * The value returned by eval (last expression run)
   */
  const [consoleReturn, setConsoleReturn] = useState<any>(undefined);

  /**
   * converts the return value to a string
   */
  const consoleReturnString = useMemo(
    () => consoleReturn + "",
    [consoleReturn]
  );

  return (
    <Col className="d-flex flex-column background-gray overflow-none-100">
      <SandBoxEditor
        setConsoleOutput={setConsoleOutput}
        setConsoleReturn={setConsoleReturn}
      />
      <SandboxOutput
        consoleOutput={consoleOutput}
        consoleReturn={consoleReturnString}
      />
    </Col>
  );
};
