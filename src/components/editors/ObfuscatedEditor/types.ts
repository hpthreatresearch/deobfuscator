// © Copyright 2023 HP Development Company, L.P.
import type { DocumentRange } from "@components/utils/types";

/**
 * Props for the ObfuscatedEditor component
 */
export interface ObfuscatedEditorProps {
  /**
   * The text that should be highlighted
   */
  selection: DocumentRange[];

  /**
   * Sets the global obfuscated code
   */
  setCode: (code: string) => void;

  /**
   * A method to clear the global state: the editors contents, the mappings...
   */
  clear: () => void;
}
