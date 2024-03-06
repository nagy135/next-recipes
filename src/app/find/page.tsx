import { api } from "~/trpc/server";
import { ListRecipes } from "../_components/list-recipes";

export default async () => {
  const recipes = await api.recipe.getAllWithIngredients.query();
  return (
    <div className="mb-8 flex min-h-screen flex-col items-center">
      <ListRecipes records={recipes} />
    </div>
  );
};
