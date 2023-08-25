// © Copyright 2023 HP Development Company, L.P.
import type { ReactSetState, ReactState } from "@core/types";

export interface ObfuscatorPanelProps {
  setObfCode: ReactSetState<string>;
  codeState: ReactState<string>;
  loading: boolean;
  mappingsState: ReactState<number[][]>;
  isOutdatedState: ReactState<boolean>;
}
