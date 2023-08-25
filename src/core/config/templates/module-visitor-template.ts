// © Copyright 2023 HP Development Company, L.P.
import * as t from "@babel/types";
import type { SupportedParams, VisitorModule } from "@core/types";
// __DOCUMENTATION_IMPORT__

export interface __TYPE__ extends SupportedParams {
  message: string;
}

const initialParams: __TYPE__ = {
  message: "value: %d",
};

export const __NAME__: VisitorModule = {
  kind: "visitor",
  initialParams,
  visitor: (params?: object) => {
    const { message } = { ...initialParams, ...params };

    /**
     * TODO: Sample code
     */
    return {
      NumericLiteral: (path) => {
        console.log(message, path.node.value);
        path.replaceWith(t.stringLiteral("42"));
      },
    };
  },
  // __DOCUMENTATION__
};
