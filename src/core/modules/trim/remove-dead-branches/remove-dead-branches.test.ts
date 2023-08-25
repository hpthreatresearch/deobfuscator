// © Copyright 2023 HP Development Company, L.P.
import {
  assertImportsDocumentation,
  assertCodeTransformation,
} from "@tests/utils";
import { removeDeadBranches } from "./remove-dead-branches";

describe("remove dead branches", () => {
  it("imports documentation", assertImportsDocumentation(removeDeadBranches));

  describe("when in an if statement", () => {
    describe("if the conditional is the literal false", () => {
      it("removes the consequent and keeps the alternate if there is one", () => {
        const input = `if (false) {
            foo();
          }

          if (false) {
            foo();
          } else {
            bar();
          }`;
        const expected = `if (false) {}

        if (false) {} else {
          bar();
        }`;

        assertCodeTransformation(input, expected, removeDeadBranches.visitor());
      });
    });

    describe("if the conditional is the literal true", () => {
      it("removes the alternate if there is one", () => {
        const input = `if (true) {
            foo();
          }
          if (true) {
            foo();
          } else {
            bar();
          }`;
        const expected = `if (true) {
            foo();
          }
          if (true) {
            foo();
          } else {}`;

        assertCodeTransformation(input, expected, removeDeadBranches.visitor());
      });
    });
  });

  describe("when in an while statement", () => {
    describe("if the condition is the literal false", () => {
      it("removes the loop", () => {
        const input = `while (false) {
            foo();
          }`;
        const expected = `while (false) {}`;

        assertCodeTransformation(input, expected, removeDeadBranches.visitor());
      });
    });
  });

  describe("when in an conditional expression", () => {
    describe("if the condition is a boolean literal", () => {
      it("removes the loop", () => {
        const input = `true ? foo() : bar(); false ? foo() : bar();`;
        const expected = `foo(); bar();`;

        assertCodeTransformation(input, expected, removeDeadBranches.visitor());
      });
    });
  });
});
