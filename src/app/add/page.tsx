import { AddRecipe } from "../_components/add-recipe";
import { ParticleLogo } from "../_components/particle-logo";

export default async function AddPage() {
  return (
    <div className="mb-8 flex min-h-screen flex-col items-center">
      <ParticleLogo title="New Recipe" />
      <AddRecipe />
    </div>
  );
};
