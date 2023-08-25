// © Copyright 2023 HP Development Company, L.P.
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { RECIPES_KEY } from "../utils";
import { OpenModal } from "./OpenModal";

const savedRecipes = {
  TEST: [
    { params: { comment: "TEST" }, name: "Comment", elevation: 0 },
    {
      params: {
        steps: 0,
        modules: [
          {
            params: {
              allowedEval: ["TEST1", "TEST2"],
              forcedConstant: "TEST",
            },
            name: "Constant folding",
            elevation: 1,
          },
          {
            params: { keep: true, ignore: "TEST" },
            name: "Remove proxy functions",
            elevation: 1,
          },
        ],
        iterations: 42,
      },
      name: "Loop",
      elevation: 0,
    },
  ],
  TEST2: [{ params: { comment: "TEST2" }, name: "Comment", elevation: 0 }],
};

const stringifiedLocalRecipes = JSON.stringify(
  Object.keys(savedRecipes).reduce((result, key) => {
    (result as any)[key] = JSON.stringify((savedRecipes as any)[key]);
    return result;
  }, {})
);

const handleClose = jest.fn();
const setCards = jest.fn();

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((item) => item === RECIPES_KEY && stringifiedLocalRecipes),
    setItem: jest.fn(() => null),
  },
  writable: true,
});

const user = userEvent.setup();

test("initialization", () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const select = screen.getByRole("combobox");
  const parsed = screen.getByRole("textbox");

  expect(select).toHaveValue("TEST");
  expect(parsed).toHaveValue(JSON.stringify(savedRecipes.TEST));
});

test("click the open button", async () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const openButton = screen.getByRole("button", { name: /Open/i });

  await user.click(openButton);

  const cards = savedRecipes.TEST.map((item) => ({
    module: item,
    id: "TEST-ID",
  }));
  expect(setCards).toBeCalledWith(cards);

  expect(handleClose).toBeCalled();
});

test("click the done button", async () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const doneButton = screen.getByRole("button", { name: /Done/i });

  await user.click(doneButton);

  expect(handleClose).toBeCalled();
});

test("click the remove button", async () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const removeButton = screen.getByRole("button", { name: /Remove/i });
  const select = screen.getByRole("combobox");
  const parsed = screen.getByRole("textbox");

  await user.click(removeButton);

  expect(window.localStorage.setItem).toBeCalledWith(
    RECIPES_KEY,
    JSON.stringify({ TEST2: JSON.stringify(savedRecipes.TEST2) })
  );

  expect(select).toHaveValue("TEST2");
  expect(parsed).toHaveValue(JSON.stringify(savedRecipes.TEST2));
});

test("change the textarea", async () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const parsed = screen.getByRole("textbox");

  await user.clear(parsed);
  await user.type(parsed, "Hello, World!");

  expect(parsed).toHaveValue("Hello, World!");
});

test("change selection", async () => {
  render(<OpenModal handleClose={handleClose} setCards={setCards} />);
  const select = screen.getByRole("combobox");
  const parsed = screen.getByRole("textbox");

  await user.selectOptions(select, "TEST2");

  expect(select).toHaveValue("TEST2");
  expect(parsed).toHaveValue(JSON.stringify(savedRecipes.TEST2));
});
