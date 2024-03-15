import { api } from "~/trpc/server";
import { ListRecipes } from "../_components/list-recipes";
import { ParticleLogo } from "../_components/particle-logo";

export default async function FindPage() {
  const recipes = await api.recipe.getAllWithIngredients.query();
  return (
    <div className="mb-8 flex min-h-screen flex-col items-center">
      <ParticleLogo title="Find" />
      <ListRecipes records={recipes} />
    </div>
  );
};
