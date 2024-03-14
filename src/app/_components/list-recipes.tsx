import { type RecipeWithIngredients } from "~/types";
import { LayoutGrid } from "./ui/layout-grid";

type ListRecipesProps = {
  records: RecipeWithIngredients[];
};

const Body = ({ title, author, description }: { title: string, author: string, description: string }) => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">{title}</p>
      <p className="font-normal text-base text-white">{author}</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        {description}
      </p>
    </div>
  );
};

export function ListRecipes({ records }: ListRecipesProps) {
  return <div className="h-screen py-20 w-full">
    <LayoutGrid cards={records.map(e => ({
      id: e.recipe?.id ?? 1,
      content: <Body
        title={e.recipe?.name ?? ""}
        author={e.recipe?.userId ?? ""}
        description={e.recipe?.description ?? ""} />,
      className: "col-span-1",
      thumbnail: e.recipe?.imagePath ?? '',
    }
    ))} />
  </div>;
}
