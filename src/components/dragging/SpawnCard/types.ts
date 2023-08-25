// © Copyright 2023 HP Development Company, L.P.
import type { MODULE_NAMES } from "@core/config";

export interface SpawnCardProps {
  name: MODULE_NAMES;
  openDocumentation: (moduleName: MODULE_NAMES) => void;
}
