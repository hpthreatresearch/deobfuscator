// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { VisitorModule } from "@core/types";
import documentation from "./documentation.md";

/**
 * A simple module to remove all the comments from a script
 */
export const stripComments: VisitorModule = {
  kind: "visitor",
  initialParams: {},
  visitor: () => ({
    enter: (path) => {
      t.removeComments(path.node);
    },
  }),
  documentation,
};
