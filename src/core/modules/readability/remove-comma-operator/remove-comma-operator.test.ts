// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import { removeCommaOperator } from "./remove-comma-operator";

describe("remove comma operator eval s", () => {
  it(
    "imports a documentation",
    assertImportsDocumentation(removeCommaOperator)
  );

  describe("when in a sequence expression", () => {
    it("does nothing", () => {
      const input = /* js */ `foo() + (bar(), 42);`;
      const expected = /* js */ `foo() + (bar(), 42)`;

      assertCodeTransformation(input, expected, removeCommaOperator.visitor());
    });

    it("replaces it with statements when the parent is an expression statement.", () => {
      const input = /* js */ `42, foo(), bar();`;
      const expected = /* js */ `42; foo(); bar();`;

      assertCodeTransformation(input, expected, removeCommaOperator.visitor());
    });
  });
});
