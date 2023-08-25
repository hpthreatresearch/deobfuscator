// © Copyright 2023 HP Development Company, L.P.
import { render, screen } from "@testing-library/react";

import { MODULE_NAMES } from "@core/config";
import type { ModuleWithID, UUID } from "@core/types";
import userEvent from "@testing-library/user-event";
import { RECIPES_KEY } from "../utils";
import { SaveModal } from "./SaveModal";

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
};

const stringifiedLocalRecipes = JSON.stringify(
  Object.keys(savedRecipes).reduce((result, key) => {
    (result as any)[key] = JSON.stringify((savedRecipes as any)[key]);
    return result;
  }, {})
);

const handleClose = jest.fn();

const cards: ModuleWithID[] = [
  {
    id: "TEST" as UUID,
    module: {
      params: { comment: "TEST2" },
      name: MODULE_NAMES.COMMENT,
      elevation: 0,
    },
  },
];

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((item) => item === RECIPES_KEY && stringifiedLocalRecipes),
    setItem: jest.fn(() => null),
  },
  writable: true,
});

const user = userEvent.setup();

const ui = () => {
  render(<SaveModal handleClose={handleClose} cards={cards} />);
};

test("initialization", () => {
  ui();
  const parsed = screen.getByRole("textbox", { name: /json/i });
  const name = screen.getByRole("textbox", { name: /name/i });

  expect(name).toHaveValue("");
  expect(parsed).toHaveValue(JSON.stringify(cards.map(({ module }) => module)));
});

test("click the done button", async () => {
  ui();
  const doneButton = screen.getByRole("button", { name: /done/i });

  await user.click(doneButton);

  expect(handleClose).toBeCalled();
});

test("click the save button", async () => {
  ui();
  const saveButton = screen.getByRole("button", { name: /save/i });
  const name = screen.getByRole("textbox", { name: /name/i });

  await user.type(name, "TEST2");
  await user.click(saveButton);

  // TODO: make this nicer
  expect(window.localStorage.setItem).toBeCalledWith(
    RECIPES_KEY,
    '{"TEST":"[{\\"params\\":{\\"comment\\":\\"TEST\\"},\\"name\\":\\"Comment\\",\\"elevation\\":0},{\\"params\\":{\\"steps\\":0,\\"modules\\":[{\\"params\\":{\\"allowedEval\\":[\\"TEST1\\",\\"TEST2\\"],\\"forcedConstant\\":\\"TEST\\"},\\"name\\":\\"Constant folding\\",\\"elevation\\":1},{\\"params\\":{\\"keep\\":true,\\"ignore\\":\\"TEST\\"},\\"name\\":\\"Remove proxy functions\\",\\"elevation\\":1}],\\"iterations\\":42},\\"name\\":\\"Loop\\",\\"elevation\\":0}]","TEST2":"[{\\"params\\":{\\"comment\\":\\"TEST2\\"},\\"name\\":\\"Comment\\",\\"elevation\\":0}]"}'
  );
  expect(handleClose).toBeCalled();
});

// test("click the save button without a name", async () => {
//   ui();
//   const saveButton = screen.getByRole("button", { name: /save/i });
//   const name = screen.getByRole("textbox", { name: /name/i });

//   await user.clear(name);
//   await user.click(saveButton);

//   expect(saveButton).toBeDisabled();

//   expect(window.localStorage.setItem).not.toHaveBeenCalled();
//   expect(handleClose).not.toHaveBeenCalled();
// });

//     test("click the done button", async () => {
//       render(<OpenModal handleClose={handleClose} setCards={setCards} />);
//       const doneButton = screen.getByRole("button", { name: /Done/i });

//       await user.click(doneButton);

//       expect(handleClose).toBeCalled();
//     });

//     test("click the remove button", async () => {
//       render(<OpenModal handleClose={handleClose} setCards={setCards} />);
//       const removeButton = screen.getByRole("button", { name: /Remove/i });
//       const select = screen.getByRole("combobox");
//       const parsed = screen.getByRole("textbox");

//       await user.click(removeButton);

//       expect(window.localStorage.setItem).toBeCalledWith(
//         RECIPES_KEY,
//         JSON.stringify({ TEST2: JSON.stringify(savedRecipes.TEST2) })
//       );

//       expect(select).toHaveValue("TEST2");
//       expect(parsed).toHaveValue(JSON.stringify(savedRecipes.TEST2));
//     });

//     test("change the textarea", async () => {
//       render(<OpenModal handleClose={handleClose} setCards={setCards} />);
//       const parsed = screen.getByRole("textbox");

//       await user.clear(parsed);
//       await user.type(parsed, "Hello, World!");

//       expect(parsed).toHaveValue("Hello, World!");
//     });

//     test("change selection", async () => {
//       render(<OpenModal handleClose={handleClose} setCards={setCards} />);
//       const select = screen.getByRole("combobox");
//       const parsed = screen.getByRole("textbox");

//       await user.selectOptions(select, "TEST2");

//       expect(select).toHaveValue("TEST2");
//       expect(parsed).toHaveValue(JSON.stringify(savedRecipes.TEST2));
//     });
//   });
