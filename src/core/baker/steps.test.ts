// © Copyright 2023 HP Development Company, L.P.
import type { ControlFlowModule, VisitorModule } from "@core/types";
import { getMaxStepsModule } from "./steps";

const mock_visitor: VisitorModule = {
  kind: "visitor",
  visitor: jest.fn(),
};

const mock_cf: ControlFlowModule = {
  kind: "controlFlow",
  operation: jest.fn(),
  steps: jest.fn(() => 42),
};

describe(getMaxStepsModule, () => {
  it("handles visitors", () => {
    expect(getMaxStepsModule(mock_visitor)).toBe(1);
  });

  it("handles cf modules", () => {
    const params = {};
    expect(getMaxStepsModule(mock_cf, params)).toBe(42);
    expect(mock_cf.steps).toBeCalledWith(params);
  });
});
