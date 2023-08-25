// © Copyright 2023 HP Development Company, L.P.
import { render, screen } from "@testing-library/react";
import { LabeledArray } from "./LabeledArray";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

test("adding an element", async () => {
  const Wrapper = () => {
    const state = useState<string[]>([]);
    return <LabeledArray state={state}>Test Array</LabeledArray>;
  };

  const user = userEvent.setup();
  render(<Wrapper />);

  const input = screen.getByRole("textbox");
  await user.type(input, "test{enter}");
  expect(input).toHaveValue("");
  expect(screen.getByText("test")).toBeInTheDocument();
});
