// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import { inlineEval } from "./inline-eval";

describe("inline eval s", () => {
  it("imports a documentation", assertImportsDocumentation(inlineEval));

  describe("when an expression statement", () => {
    it("replaces valid eval", () => {
      const input = /* js */ `eval("41");`;
      const expected = /* js */ `41;`;

      assertCodeTransformation(input, expected, inlineEval.visitor());
    });
  });
});
