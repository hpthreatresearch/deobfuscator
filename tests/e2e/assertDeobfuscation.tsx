// © Copyright 2023 HP Development Company, L.P.
import App from "@components/App";

import { RECIPES_KEY } from "@components/recipe-builder/recipe/modals/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fs from "fs";
import path from "path";

import type { DeobfuscatedEditorProps } from "@components/editors/DeobfuscatedEditor/types";
import type { ObfuscatedEditorProps } from "@components/editors/ObfuscatedEditor/types";
import { useState } from "react";

/**
 * Mocks the editors to not have to deal with code mirror
 */
function MockEditor(props: DeobfuscatedEditorProps | ObfuscatedEditorProps) {
  const isObf = !("code" in props);
  const [value, setValue] = useState("");

  return (
    <input
      value={isObf ? value : props.code}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        isObf && props.setCode(v);
      }}
      data-testid={isObf ? "obfuscated-editor" : "deobfuscated-editor"}
    />
  );
}

jest.mock("@components/editors/DeobfuscatedEditor/DeobfuscatedEditor", () => ({
  DeobfuscatedEditor: MockEditor,
}));

jest.mock("@components/editors/ObfuscatedEditor/ObfuscatedEditor", () => ({
  ObfuscatedEditor: MockEditor,
}));

export const assertDeobfuscation = async (
  obfuscatedFile: string,
  recipeName: string
) => {
  const obfuscatedPath = path.join(__dirname, "../samples/", obfuscatedFile);
  const obfuscated = fs.readFileSync(obfuscatedPath, "utf8");

  const localRecipesPath = path.join(
    __dirname,
    "../samples",
    "localRecipes.json"
  );
  const localRecipes = JSON.parse(fs.readFileSync(localRecipesPath, "utf-8"));

  const stringifiedLocalRecipes = JSON.stringify(
    Object.keys(localRecipes).reduce((result, key) => {
      (result as any)[key] = JSON.stringify(localRecipes[key]);
      return result;
    }, {})
  );

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(
        (item) => item === RECIPES_KEY && stringifiedLocalRecipes
      ),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });

  const user = userEvent.setup();
  render(<App />);

  console.info("Typing the obfuscated code...");
  const obfuscatedEditor = screen.getByTestId("obfuscated-editor");
  // await user.type(obfuscatedEditor, obfuscated.replace(/[{[]/g, "$&$&"));
  /**
   * NOTE:
   * We need to use this method because it would take too long to type the code
   */
  fireEvent.change(obfuscatedEditor, { target: { value: obfuscated } });

  /**
   * Select the obfuscator.io recipe
   */
  console.info("Choosing the recipe...");
  const load = screen.getByTestId("load-recipe");

  await user.click(load);

  const select = screen.getByRole("combobox");

  await user.selectOptions(select, recipeName);

  const openButton = screen.getByRole("button", { name: /open/i });

  await user.click(openButton);

  /**
   * Clicks the bake button
   */

  console.info("Baking...");
  const bake = screen.getByRole("button", { name: /bake/i });
  await user.click(bake);

  await waitFor(() => expect(bake).not.toBeDisabled(), {
    timeout: 5000,
  });

  const deobfuscatedEditor = screen.getByTestId(
    "deobfuscated-editor"
  ) as HTMLInputElement;

  expect({ value: deobfuscatedEditor.value }).toMatchSnapshot();

  return deobfuscatedEditor.value;
};
