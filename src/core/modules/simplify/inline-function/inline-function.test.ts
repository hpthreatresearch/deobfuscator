// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import { inlineFunction } from "./inline-function";

describe("inlineFunction", () => {
  it("imports a documentation", assertImportsDocumentation(inlineFunction));

  it("inline's calls to Function", () => {
    const input = /* js */ `Function("return 42;")`;
    const expected = /* js */ `(function () {return 42;});`;

    assertCodeTransformation(input, expected, inlineFunction.visitor());
  });
});
