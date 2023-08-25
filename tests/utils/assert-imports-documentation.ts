// © Copyright 2023 HP Development Company, L.P.
import type { DeobfuscatorModule } from "@core/types";

/**
 * Expects a module's documentation to be truthy
 */
export const assertImportsDocumentation =
  (module: DeobfuscatorModule) => () => {
    expect(module.documentation).toBe("test-file-stub");
  };
