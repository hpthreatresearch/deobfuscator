// © Copyright 2023 HP Development Company, L.P.
import type { ReactSetState } from "@core/types";

/**
 * Props for the SandBoxEditor component
 */
export interface SandBoxEditorProps {
  setConsoleOutput: ReactSetState<string[]>;
  setConsoleReturn: ReactSetState<any>;
}
