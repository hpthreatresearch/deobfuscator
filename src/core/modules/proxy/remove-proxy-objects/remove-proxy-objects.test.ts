// © Copyright 2023 HP Development Company, L.P.
import { assertCodeTransformation } from "@tests/utils";
import { removeProxyObject } from "./remove-proxy-objects";

describe("removeProxyObject", () => {
  describe("when in a VariableDeclarator", () => {
    it("removes proxy objects", () => {
      const input = /* js */ `var a = {foo: function (x){ return x + 1}, bar: 42 }; a.foo(a.bar)`;
      const expected = /* js */ `var a = {foo: function (x){ return x + 1}, bar: 42 }; 42 + 1`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("handles computed properties", () => {
      const input = /*js*/ `var a = {["foo"]: 42, bar: 666}; a["foo"] + a["bar"]`;
      const expected = /*js*/ `var a = {["foo"]: 42, bar: 666}; 42 + 666`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores non objects and destruction", () => {
      const input = /*js*/ `var {foo} = {foo: 42}, a = 2;`;
      const expected = /*js*/ `var {foo} = {foo: 42}, a = 2;`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores objects that aren't in a member expression", () => {
      const input = /*js*/ `var a = {foo: 42}; a`;
      const expected = /*js*/ `var a = {foo: 42}; a`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores objects that aren't constant", () => {
      const input = /*js*/ `var a = {foo: 42}; a = {foo: 666}; a.foo;`;
      const expected = /*js*/ `var a = {foo: 42}; a = {foo: 666}; a.foo;`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores functions that aren't simple return statements", () => {
      const input = /*js*/ `var a = {foo1: function () {return;}, foo2: function () {5;}, foo3: function () {var test = 1 + 1; return test; } }; a.foo1(); a.foo2(); a.foo3()`;
      const expected = /*js*/ `var a = {foo1: function () {return;}, foo2: function () {5;}, foo3: function () {var test = 1 + 1; return test; } }; a.foo1(); a.foo2(); a.foo3()`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores spreads", () => {
      const input = /*js*/ `var a = {...console}; a.log()`;
      const expected = /*js*/ `var a = {...console}; a.log()`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores properties it does not know about", () => {
      const input = /*js*/ `var a = {foo: 42}; a.bar`;
      const expected = /*js*/ `var a = {foo: 42}; a.bar`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("ignores spread in function definition", () => {
      const input = /*js*/ `var a = {foo: function (...args) {console.log(...args)}}; a.foo("bar")`;
      const expected = /*js*/ `var a = {foo: function (...args) {console.log(...args)}}; a.foo("bar")`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });

    it("adds properties defined just after the object definition", () => {
      const input = /*js*/ `var a = {}; a.foo = 42; a.foo`;
      const expected = /*js*/ `var a = {foo: 42}; 42`;

      assertCodeTransformation(input, expected, removeProxyObject.visitor());
    });
  });
});
