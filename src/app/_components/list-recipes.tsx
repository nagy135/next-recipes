import { type RecipeWithIngredients } from "~/types";
import { LayoutGrid } from "./ui/layout-grid";

type ListRecipesProps = {
  records: RecipeWithIngredients[];
};

const Body = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">Rivers are serene</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

export function ListRecipes({ records }: ListRecipesProps) {
  return <div className="h-screen py-20 w-full">
    <LayoutGrid cards={records.map(e => ({
      id: e.recipe?.id ?? 1,
      content: <Body />,
      className: "col-span-1",
      thumbnail: e.recipe?.imagePath ?? '',
    }
    ))} />
  </div>;
}
