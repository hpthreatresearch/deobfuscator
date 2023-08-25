// © Copyright 2023 HP Development Company, L.P.
import type { DocumentRange } from "@components/utils/types";
import type { ReactSetState } from "@core/types";

export interface DeobfuscatedEditorProps {
  setSelection: ReactSetState<DocumentRange[]>;
  code: string;
  isOutDated: boolean;
  loading: boolean;
}
