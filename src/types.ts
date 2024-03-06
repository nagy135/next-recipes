import { type SelectIngredient, type SelectRecipe } from "./server/db/schema";

export type RecipeWithIngredients = {
  recipe?: SelectRecipe;
  ingredients: (SelectIngredient & { amount: string | null })[];
};
