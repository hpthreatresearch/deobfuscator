// © Copyright 2023 HP Development Company, L.P.
import {
  assertImportsDocumentation,
  assertCodeTransformation,
} from "@tests/utils";
import type { RemoveSingleArgsParams } from "./remove-single-args";
import { removeSingleArgs } from "./remove-single-args";

describe("remove single args", () => {
  it("imports documentation", assertImportsDocumentation(removeSingleArgs));

  describe("when targeting a function declaration", () => {
    it("ignores functions that are called multiple times", () => {
      const input = /* js */ `function foo(bar) {return bar;} foo("bar"); foo(42);`;
      const expected = /* js */ `function foo(bar) {return bar;} foo("bar"); foo(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("ignores functions that aren't called", () => {
      const input = /* js */ `function foo(bar) {return bar;} var a = foo;`;
      const expected = /* js */ `function foo(bar) {return bar;} var a = foo;`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("ignores functions that are redefined", () => {
      const input = /* js */ `function foo(bar) {return bar;} foo = console.log; foo(42);`;
      const expected = /* js */ `function foo(bar) {return bar;} foo = console.log; foo(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("replaces args for a function called only once", () => {
      const input = /* js */ `function foo(bar) {return bar;} foo(42);`;
      const expected = /* js */ `function foo(bar) {return 42;} foo(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });
  });

  describe("when targeting a function expression", () => {
    it("only applies to call expressions", () => {
      const input = /* js */ `!function foo(bar) {return bar;};`;
      const expected = /* js */ `!function foo(bar) {return bar;};`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("replace arguments for a function expressions in a call expression", () => {
      const input = /* js */ `!function foo(bar) {return bar;}(42);`;
      const expected = /* js */ `!function foo(bar) {return 42;}(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("ignores params that aren't identifiers", () => {
      const input = /* js */ `!function foo(...bar) {return bar;}(42);`;
      const expected = /* js */ `!function foo(...bar) {return bar;}(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("ignores params that aren't constant", () => {
      const input = /* js */ `!function foo(bar) {bar = 4; return bar;}(42);`;
      const expected = /* js */ `!function foo(bar) {bar = 4; return bar;}(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("ignores tagged functions", () => {
      const input = /* js */ `! (/* [#KEEP ARGS#] */ function foo(bar) {return bar;})(42);`;
      const expected = /* js */ `! (/* [#KEEP ARGS#] */ function foo(bar) {return bar;})(42);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    it("only accepts literal params by default", () => {
      const input = /* js */ `!function foo(bar) {return bar;}(console);`;
      const expected = /* js */ `!function foo(bar) {return bar;}(console);`;

      assertCodeTransformation(input, expected, removeSingleArgs.visitor());
    });

    describe("when replaceAll is set", () => {
      const params: RemoveSingleArgsParams = {
        replaceAll: true,
        ignore: "[#KEEP ARGS#]",
      };
      it("accepts non literal arguments", () => {
        const input = /* js */ `!function foo(bar) {return bar;}(console);`;
        const expected = /* js */ `!function foo(bar) {return console;}(console);`;

        assertCodeTransformation(
          input,
          expected,
          removeSingleArgs.visitor(params)
        );
      });
    });

    describe("when ignore is set", () => {
      const params: RemoveSingleArgsParams = {
        replaceAll: false,
        ignore: "[#TEST#]",
      };

      it("ignores tagged functions", () => {
        const input = /* js */ `!(/* [#TEST#] */ function foo(bar) {return bar;})(42);`;
        const expected = /* js */ `!(/* [#TEST#] */ function foo(bar) {return bar;})(42);`;

        assertCodeTransformation(
          input,
          expected,
          removeSingleArgs.visitor(params)
        );
      });
    });
  });
});
