// © Copyright 2023 HP Development Company, L.P.
import { parse, parseExpression } from "@babel/parser";
import type { NodeComparator } from "./utils";
import { NC_LITERALS } from "./utils";
import { NC_AND } from "./utils";
import { NC_OR } from "./utils";
import { NC_STRUCTURE, compareTrees } from "./utils";

const NC_TRUE: NodeComparator = () => true;
const NC_FALSE: NodeComparator = () => false;

describe(compareTrees, () => {
  it("returns true identical trees", () => {
    const model = parseExpression(/* js */ `console.log("Hello, World!")`);
    const test = parseExpression(/* js */ `console.log("Hello, World!")`);

    expect(compareTrees(model, test, NC_STRUCTURE)).toBe(true);
  });

  it("return false for different trees", () => {
    const model = parseExpression(/* js */ `console.log("Hello, World!")`);
    const test = parseExpression(/* js */ `42`);

    expect(compareTrees(model, test, NC_STRUCTURE)).toBe(false);
  });

  it("return false for different trees 2", () => {
    const model = parse(/* js */ `var a = 42;`);
    const test = parse(/* js */ `var a;`);

    expect(compareTrees(model, test, NC_TRUE)).toBe(false);
  });

  it("return false if the test tree is shorter", () => {
    const model = parseExpression(
      /* js */ `console.log("Hello, World!"), 42, 4`
    );
    const test = parseExpression(/* js */ `console.log("Hello, World!"), 42`);

    expect(compareTrees(model, test, NC_TRUE)).toBe(false);
  });
});

describe(NC_OR, () => {
  it("matches if at least one visitor is true", () => {
    const model = parseExpression(/* js */ `42`);
    const test = parseExpression(/* js */ `42`);

    expect(compareTrees(model, test, NC_OR(NC_TRUE, NC_FALSE))).toBe(true);
  });

  it("does not match if all visitors are false", () => {
    const model = parseExpression(/* js */ `42`);
    const test = parseExpression(/* js */ `42`);

    expect(compareTrees(model, test, NC_OR(NC_FALSE, NC_FALSE))).toBe(false);
  });
});

describe(NC_AND, () => {
  it("matches if all visitors are true", () => {
    const model = parseExpression(/* js */ `42`);
    const test = parseExpression(/* js */ `42`);

    expect(compareTrees(model, test, NC_AND(NC_TRUE, NC_TRUE))).toBe(true);
  });

  it("does not match if at least one visitor is false", () => {
    const model = parseExpression(/* js */ `42`);
    const test = parseExpression(/* js */ `42`);

    expect(compareTrees(model, test, NC_AND(NC_FALSE, NC_TRUE))).toBe(false);
  });
});

describe(NC_LITERALS, () => {
  it("matches if all literals are true", () => {
    const model = parseExpression(/* js */ `42, null`);
    const test = parseExpression(/* js */ `42, null`);

    expect(compareTrees(model, test, NC_LITERALS)).toBe(true);
  });
});
