// © Copyright 2023 HP Development Company, L.P.
import { DeobfuscatedEditor } from "@components/editors/DeobfuscatedEditor/DeobfuscatedEditor";
import { ObfuscatedEditor } from "@components/editors/ObfuscatedEditor/ObfuscatedEditor";
import { getObfPositionOfMapping } from "@components/utils/source-mappings";
import type { DocumentRange } from "@components/utils/types";
import type { ReactSetState } from "@core/types";
import { useCallback, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import type { ObfuscatorPanelProps } from "./types";

export const ObfuscatorPanel = ({
  setObfCode,
  codeState,
  loading,
  mappingsState,
  isOutdatedState,
}: ObfuscatorPanelProps) => {
  const [deobfSelection, setDeobfSelection] = useState<DocumentRange[]>([]);

  const [isOutDated, setIsOutDated] = useMemo(
    () => isOutdatedState,
    [isOutdatedState]
  );

  const [mappings, setMappings] = useMemo(() => mappingsState, [mappingsState]);
  const [code, setCode] = useMemo(() => codeState, [codeState]);

  /**
   * When the obfuscated code is modified remove the highlighting.
   */
  const _setObfCode: ReactSetState<string> = useCallback(
    (obfCode) => {
      setObfCode(obfCode);
      setMappings([]);
      setIsOutDated(true);
    },
    [setMappings, setObfCode, setIsOutDated]
  );

  /**
   * Handler for the clear button (trash) in the obfuscated code panel.
   */
  const handleClear = useCallback(() => {
    setCode("");
    setMappings([]);
    setIsOutDated(false);
  }, [setCode, setMappings, setIsOutDated]);

  /**
   * When the deobf selection changes, sets the obfuscated selection state using the mappings
   */
  const obfSelection = useMemo(() => {
    if (
      !deobfSelection.length ||
      !mappings ||
      mappings.length === 0 ||
      isOutDated
    )
      return [];

    const obfSelection = {
      from: getObfPositionOfMapping(mappings, deobfSelection[0].from),
      to: getObfPositionOfMapping(mappings, deobfSelection[0].to, true),
    };

    if (obfSelection.from > obfSelection.to) {
      return [];
    }

    return [obfSelection];
  }, [mappings, deobfSelection, isOutDated]);

  return (
    <Col className="d-flex flex-column background-gray overflow-none-100">
      <ObfuscatedEditor
        setCode={_setObfCode}
        clear={handleClear}
        selection={obfSelection}
      />
      <DeobfuscatedEditor
        code={code}
        setSelection={setDeobfSelection}
        loading={loading}
        isOutDated={isOutDated}
      />
    </Col>
  );
};
