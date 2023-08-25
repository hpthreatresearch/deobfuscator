// © Copyright 2023 HP Development Company, L.P.
import { useCallback, useEffect, useMemo } from "react";

import { TitleBlock } from "@components/basic/TitleBlock";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import type { OnChange } from "../../code-mirror/";
import type { DeobfuscatedEditorProps } from "./types";
import { readOnlyExtension, useCodeEditor } from "@components/code-mirror";
import type { ViewUpdate } from "@codemirror/view";

/*
 * The editor for the deobfuscated code
 *
 * This editor is not editable
 * When the user makes a selection the obfuscated editor should highlight the matching code
 */
export const DeobfuscatedEditor = ({
  setSelection,
  code: deObfCode,
  isOutDated,
  loading,
}: DeobfuscatedEditorProps) => {
  /**
   * Handler for codemirror
   *
   * If the selection changed, update the global selection
   */
  const onChange: OnChange = useCallback(
    (update: ViewUpdate) => {
      if (update.selectionSet) {
        const { from, to } = update.state.selection.main;

        const fromLine = update.state.doc.lineAt(from);
        const toLine = update.state.doc.lineAt(to);

        const documentRange = {
          from: {
            line: fromLine.number,
            col: from - fromLine.from,
          },
          to: {
            line: toLine.number,
            col: to - toLine.from,
          },
        };
        setSelection([documentRange]);
      }
    },
    [setSelection]
  );

  /**
   * codemirror
   */
  const { ref, setCode } = useCodeEditor({
    onChange,
    extensions: [readOnlyExtension],
  });

  /**
   * Update the editor's code to match the global deobfuscated code
   */
  useEffect(() => {
    setCode(deObfCode);
  }, [setCode, deObfCode]);

  /**
   * A copy icon to copy the deobfuscated code
   */
  const icons = useMemo(
    () => [
      {
        icon: faCopy,
        description: "Copy deobfuscated code",
        onClick: () => {
          navigator.clipboard.writeText(deObfCode);
        },
      },
    ],
    [deObfCode]
  );

  return (
    <div className="d-flex flex-column background-white h-50 mh-50">
      <TitleBlock icons={icons}>
        Deobfuscated {!!deObfCode && isOutDated ? "(Out of sync)" : ""}
      </TitleBlock>
      <div className="fill-under-title">
        {/* FIXME: the loading is not great and acts weird with use ref */}
        <div
          className={
            "h-100 align-items-center justify-content-center " +
            (loading ? "d-flex" : "d-none")
          }
        >
          <Spinner animation="border" role="status" />
        </div>

        <div
          hidden={loading}
          className={
            "position-relative background-white flex-grow-1 mh-100 h-100 " +
            (loading ? "d-none" : "")
          }
          data-testid="deobfuscated-editor"
          ref={ref}
        />
      </div>
    </div>
  );
};
