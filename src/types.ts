import { SelectIngredient, SelectRecipe } from "./server/db/schema";

export type RecipeWithIngredients = {
  recipe?: SelectRecipe;
  ingredients: (SelectIngredient & { amount: string | null })[];
};
