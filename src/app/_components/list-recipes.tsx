import { Separator } from "~/components/ui/separator";
import { RecipeWithIngredients } from "~/types";

type ListRecipesProps = {
  records: RecipeWithIngredients[];
};

export function ListRecipes({ records }: ListRecipesProps) {
  return (
    <>
      {records.map((record) => (
        <>
          <div key={record.recipe?.id}>
            <h1>{record.recipe?.name}</h1>
            <h1>Ingredients:</h1>
            <ul>
              {record.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.amount} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
          <Separator />
        </>
      ))}
    </>
  );
}
