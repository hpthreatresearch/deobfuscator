// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import { removeStringHex } from "./remove-string-hex";

describe("remove string hex", () => {
  it("imports documentation", assertImportsDocumentation(removeStringHex));

  it("remove escape sequences from string literals", () => {
    const input = /* js */ `console.log("\\xA9\\u0020\\u{00AE}\\b\\uD83D\\uDE0A")`;
    const expected = /* js */ `console.log("© ®\\b😊")`;

    assertCodeTransformation(input, expected, removeStringHex.visitor());
  });
  it("remove escape sequences from directive literals", () => {
    const input = /* js */ `"\\xA9\\u0020\\u{00AE}\\b\\uD83D\\uDE0A"`;
    const expected = /* js */ `"© ®\\b😊"`;

    assertCodeTransformation(input, expected, removeStringHex.visitor());
  });
});
