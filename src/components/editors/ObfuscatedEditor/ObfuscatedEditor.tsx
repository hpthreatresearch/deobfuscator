// © Copyright 2023 HP Development Company, L.P.
import { useCallback, useEffect, useMemo } from "react";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TitleBlock } from "../../basic/TitleBlock";
import {
  ExtSelectionState,
  extSelectionExtension,
  setExtSelection,
  useCodeEditor,
} from "../../code-mirror/";
import type { ObfuscatedEditorProps } from "./types";

/**
 * The editor for the obfuscated code
 *
 * This editor is editable and certain lines need to be highlighted when selections are made in the
 * deobfuscated editor
 */
export const ObfuscatedEditor = ({
  selection,
  setCode: setObfCode,
  clear,
}: ObfuscatedEditorProps) => {
  /**
   * codemirror
   */
  const { ref, view, code, setCode } = useCodeEditor({
    //  extSelectionExtension is the extension responsible of the highlighting
    extensions: [extSelectionExtension],
  });

  /**
   * If a selection is made, update the codemirror view.
   * This will trigger the extension
   */
  useEffect(() => {
    if (selection && view) {
      view.dispatch({
        effects: setExtSelection.of(new ExtSelectionState(selection)),
      });
    }
  }, [selection, view]);

  /**
   * Updates the app's obfuscated code if the user modifies it in the editor
   */
  useEffect(() => {
    setObfCode(code);
  }, [code, setObfCode]);

  /**
   * Handler for the clear (trash) button.
   *
   * Clears the editor code and the global state
   */
  const handleClear = useCallback(() => {
    setCode("");
    clear();
  }, [setCode, clear]);

  /**
   * The icons fo the title bar
   */
  const icons = useMemo(
    () => [
      {
        icon: faTrash,
        description: "Clear obfuscated & deobfuscated panels",
        onClick: handleClear,
      },
    ],
    [handleClear]
  );

  return (
    <div className="d-flex flex-column background-white h-50">
      <TitleBlock icons={icons}>Obfuscated</TitleBlock>
      <div className="fill-under-title">
        <div
          className="position-relative background-white flex-grow-1 mh-100 h-100"
          data-testid="obfuscated-editor"
          ref={ref}
        />
      </div>
    </div>
  );
};
