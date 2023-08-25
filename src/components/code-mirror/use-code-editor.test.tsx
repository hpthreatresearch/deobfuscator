// © Copyright 2023 HP Development Company, L.P.
import { renderHook } from "@testing-library/react";
import { useCodeEditor } from "./use-code-editor";

describe(useCodeEditor, () => {
  describe("initialization", () => {
    it("respects defaultCode", () => {
      const { result } = renderHook(() =>
        useCodeEditor({
          defaultCode: "Hello, World!",
        })
      );

      expect(result.current.code).toBe("Hello, World!");
    });

    it("uses a sample otherwise", () => {
      const { result } = renderHook(() => useCodeEditor({}));

      expect(result.current.code).toBeTruthy();
    });
  });

  // TODO: make this better
});
