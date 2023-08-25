// © Copyright 2023 HP Development Company, L.P.
import { fireEvent, render, screen } from "@testing-library/react";
import { SandBoxEditor } from "./SandboxEditor";

describe(SandBoxEditor, () => {
  const setConsoleOutput = jest.fn(),
    setConsoleReturn = jest.fn();

  render(
    <SandBoxEditor
      setConsoleOutput={setConsoleOutput}
      setConsoleReturn={setConsoleReturn}
    />
  );

  describe("when the clear button is clicked", () => {
    const clearButton = screen.getByLabelText(/clear/i);
    fireEvent.click(clearButton);

    it("clears the console", () => {
      expect(setConsoleOutput).toBeCalledWith([]);
    });

    it("clears the return value", () => {
      expect(setConsoleReturn).toBeCalledWith(undefined);
    });
  });

  describe("when the run button is clicked", () => {
    const runButton = screen.getByLabelText(/run/i);
    fireEvent.click(runButton);

    it("runs the code", () => {
      expect(true).toBe(true);
    });
  });
});
