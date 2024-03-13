import { Separator } from "~/components/ui/separator";
import { type RecipeWithIngredients } from "~/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button } from "./ui/button";

type ListRecipesProps = {
  records: RecipeWithIngredients[];
};

export function ListRecipes({ records }: ListRecipesProps) {
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{record.recipe?.name ?? '-'}</CardTitle>
              <CardDescription>by {record.recipe?.userId}</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter>
              <Button className="w-full">View</Button>
            </CardFooter>
          </Card>
        </>
      ))}
    </div>
  );
}
