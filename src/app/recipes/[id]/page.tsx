import { redirect } from "next/navigation";
import { api } from "~/trpc/server"
import Image from "next/image";

export default async function RecipePage({ params: { id } }: { params: { id: string } }) {
  const recipe = await api.recipe.getOneWithIngredients.query({ id: parseInt(id) });
  if (!recipe) redirect('/find');
  return (
    <div className="mb-8 flex min-h-screen flex-col gap-5 items-center px-4">
      {recipe.imagePath && <Image
        width={500}
        height={500}
        src={recipe.imagePath}
        alt={'Recipe image'} />}
      <div>{recipe.name}</div>
      <div className='container w-full my-5 md:w-2/3 text-justify'>{recipe.description}</div>
      {recipe.usage.map((u) => (
        <p>{u.ingredient.name} - {u.amount}</p>
      ))}
    </div>
  )
}
