// © Copyright 2023 HP Development Company, L.P.
import {
  assertCodeTransformation,
  assertImportsDocumentation,
} from "@tests/utils";
import type { RemoveUnusedVarsParams } from "./remove-unused-vars";
import { removeUnusedVars } from "./remove-unused-vars";

describe("remove unused variables", () => {
  it("imports a documentation", assertImportsDocumentation(removeUnusedVars));

  describe("when handling a variable", () => {
    it("does not handle deconstruction", () => {
      const input = /* js */ `var [foo, bar] = [42, "Hello, World!"];`;
      const expected = /* js */ `var [foo, bar] = [42, "Hello, World!"];`;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    it("keeps variables that are referenced", () => {
      const input = /* js */ `var bar = 42; console.log(bar);`;
      const expected = /* js */ `var bar = 42; console.log(bar);`;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    it("removes variables that are not referenced", () => {
      const input = /* js */ `var foo = 0;`;
      const expected = /* js */ ``;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    it("keeps tagged variables", () => {
      const input = /* js */ `var /* [#NOT UNUSED#] */ foo = 0;`;
      const expected = /* js */ `var /* [#NOT UNUSED#] */ foo = 0;`;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    describe("when not given a parameter", () => {
      const parameter: RemoveUnusedVarsParams = {
        ignore: "[#TEST#]",
      };

      it("keeps tagged variables using the new tag", () => {
        const input = /* js */ `var /* [#TEST#] */ foo = 0;`;
        const expected = /* js */ `var /* [#TEST#] */ foo = 0;`;

        assertCodeTransformation(
          input,
          expected,
          removeUnusedVars.visitor(parameter)
        );
      });
    });
  });

  describe("when handling a function", () => {
    it("keeps referenced function", () => {
      const input = /* js */ `function foo () {return 42;} foo();`;
      const expected = /* js */ `function foo () {return 42;} foo();`;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    it("removes functions that are not referenced", () => {
      const input = /* js */ `function foo () {return 42;}`;
      const expected = /* js */ ``;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });

    it("keeps tagged functions", () => {
      const input = /* js */ `/* [#NOT UNUSED#] */ function foo () {return 42;}`;
      const expected = /* js */ `/* [#NOT UNUSED#] */ function foo () {return 42;}`;

      assertCodeTransformation(input, expected, removeUnusedVars.visitor());
    });
  });
});
