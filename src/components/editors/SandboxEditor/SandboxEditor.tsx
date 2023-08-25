// © Copyright 2023 HP Development Company, L.P.
import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useMemo } from "react";
import { TitleBlock } from "../../basic/TitleBlock";
import { useCodeEditor } from "../../code-mirror/use-code-editor";
import type { SandBoxEditorProps } from "./types";
import { defaultCode } from "./utils";
import { safeEval } from "@core/utils";

/**
 * The rightmost editor: A sandbox to play around with JS.
 *
 * This sandbox is purposefully simplistic and as such very vulnerable
 * However, you should be running this program in a dedicated VM / secure
 * environment so it shouldn't matter
 */
export const SandBoxEditor = ({
  setConsoleOutput,
  setConsoleReturn,
}: SandBoxEditorProps) => {
  /**
   * codemirror
   */
  const { ref, code, setCode } = useCodeEditor({
    extensions: [],
    defaultCode,
  });

  /**
   * Handler for the `Clear` (trash) button
   *
   * Clears the code and output
   */
  const handleClear = useCallback(() => {
    setConsoleReturn(undefined);
    setConsoleOutput([]);
    setCode("");
  }, [setConsoleOutput, setCode, setConsoleReturn]);

  /**
   * HACK: Run for the sandbox editor
   *
   * Handler for the `Run` (triangle) button
   *
   * Runs the code.
   *
   *  -> View the component comment for security concerns
   */
  const handleRun = useCallback(() => {
    setConsoleOutput([]);

    // Hooks console.log to retrieve the printed messages
    const old_log = console.log;

    console.log = function (...args: string[]) {
      old_log(...args);
      setConsoleOutput((old) => [...old, ...args]);
    };

    try {
      // HACK: Indirect eval to escape strict mode
      /* eslint-disable no-eval */
      const ret = safeEval(code);
      setConsoleReturn(ret);
    } catch (e: unknown) {
      // Will not appear in the output panel
      console.error(e);
      setConsoleOutput((old) => [...old, e + ""]);
      setConsoleReturn(undefined);
    }

    // Resets console.log
    console.log = old_log;
  }, [code, setConsoleOutput, setConsoleReturn]);

  /**
   * On Shift+Enter run the code
   *
   * HACK: codemirror's keybindings were not working with React state.
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        handleRun();
        e.preventDefault();
      }
    },
    [handleRun]
  );

  /**
   * Icons fo the title block
   */
  const icons = useMemo(
    () => [
      {
        icon: faPlay,
        description: "Run",
        onClick: handleRun,
        label: "run",
      },
      {
        icon: faTrash,
        description: "Clear sandbox",
        onClick: handleClear,
        label: "clear",
      },
    ],
    [handleClear, handleRun]
  );

  return (
    <div className="d-flex flex-column background-white h-50">
      <TitleBlock icons={icons} style={{ paddingRight: 75 }}>
        Sandbox
      </TitleBlock>
      <div className="fill-under-title">
        <div
          className="background-white mb-3 p-2 overflow-auto h-100 mh-100"
          ref={ref}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
