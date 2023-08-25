// © Copyright 2023 HP Development Company, L.P.
import { assertCodeTransformation } from "@tests/utils";
import { removeMemberAccess } from "./rename-member-access";

describe("rename member access", () => {
  describe("when in a member expression", () => {
    it("replaces it with a .", () => {
      const input = /* js */ `a["toString"], a["0"]`;
      const expected = /* js */ `a.toString, a["0"]`;

      assertCodeTransformation(input, expected, removeMemberAccess.visitor());
    });
  });
});
