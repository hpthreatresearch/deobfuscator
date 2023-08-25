// © Copyright 2023 HP Development Company, L.P.
import { useState } from "react";
import type { RecipeBook, SetRecipeBook } from "./types";
import type { ReactSetState } from "@core/types";

/**
 * The key under which the local recipes are saved
 */
export const RECIPES_KEY = "savedRecipes";

/**
 * Gets all the recipes from local storage
 */
const getLocalRecipes = (): RecipeBook => {
  const savedRecipes = window.localStorage.getItem(RECIPES_KEY);
  return savedRecipes ? JSON.parse(savedRecipes) : {};
};

const saveLocalRecipes = (recipeBook: RecipeBook): void => {
  const stringified = JSON.stringify(recipeBook);
  window.localStorage.setItem(RECIPES_KEY, stringified);
};

/**
 * Hook for retrieving and setting recipes from local storage
 */
export const useLocalRecipes = (): [RecipeBook, SetRecipeBook] => {
  const [localRecipes, _setLocalRecipes] = useState<RecipeBook>(
    getLocalRecipes()
  );

  const setLocalRecipes: ReactSetState<RecipeBook> = (recipes) => {
    let new_recipes;
    if (typeof recipes === "function") new_recipes = recipes(localRecipes);
    else new_recipes = recipes;

    saveLocalRecipes(new_recipes);

    _setLocalRecipes(new_recipes);
  };

  return [localRecipes, setLocalRecipes];
};
