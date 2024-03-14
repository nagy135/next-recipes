import { type RecipeWithIngredients } from "~/types";
import { LayoutGrid } from "./ui/layout-grid";
import { Button } from "./ui/button";
import Link from "next/link";

type ListRecipesProps = {
  records: RecipeWithIngredients[];
};

const Body = ({ id, title, author, description, ingredients }:
  {
    id: number,
    title: string,
    author: string,
    description: string,
    ingredients: { name: string | null, amount: string | null }[]
  }) => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">{title}</p>
      <p className="font-normal text-base text-white">{author}</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        {description.substring(0, 200)}...
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        {ingredients.map(e => <p>{e.name} - {e.amount}</p>)}
      </p>
      <div className="w-full flex justify-end">
        <Link href={`/recipes/${id}`}>
          <Button variant="outline">View</Button>
        </Link>
      </div>
    </div>
  );
};

export function ListRecipes({ records }: ListRecipesProps) {
  return <div className="h-screen py-20 w-full">
    <LayoutGrid cards={records.map(e => ({
      id: e.recipe?.id ?? 1,
      content: <Body
        id={e.recipe?.id ?? 0}
        title={e.recipe?.name ?? ""}
        author={e.recipe?.userId ?? ""}
        ingredients={e.ingredients.map(e => ({ name: e.name, amount: e.amount })) ?? []}
        description={e.recipe?.description ?? ""} />,
      className: "col-span-1",
      thumbnail: e.recipe?.imagePath ?? '',
    }
    ))} />
  </div>;
}
