// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import { removeIntHex } from "./remove-int-hex";

describe("remove hex in int", () => {
  it("imports a documentation", assertImportsDocumentation(removeIntHex));

  describe("when in a numeric literal", () => {
    it("handles binary", () => {
      const input = /* js */ `0b00101010;`;
      const expected = /* js */ `42;`;

      assertCodeTransformation(input, expected, removeIntHex.visitor());
    });

    it("handles octal", () => {
      const input = /* js */ `052;`;
      const expected = /* js */ `42;`;

      assertCodeTransformation(input, expected, removeIntHex.visitor());
    });

    it("handles hex", () => {
      const input = /* js */ `0x2a`;
      const expected = /* js */ `42;`;

      assertCodeTransformation(input, expected, removeIntHex.visitor());
    });

    it("handles separators", () => {
      const input = /* js */ `4_2`;
      const expected = /* js */ `42;`;

      assertCodeTransformation(input, expected, removeIntHex.visitor());
    });

    it("handles exponents", () => {
      const input = /* js */ `42e0`;
      const expected = /* js */ `42;`;

      assertCodeTransformation(input, expected, removeIntHex.visitor());
    });
  });
});
