import { unstable_noStore as noStore } from "next/cache";

import Title from "./_components/title";
import Link from "next/link";
import { Button } from "./_components/ui/button";

export default async function Home() {
  noStore();

  return (
    <main className="mb-8 flex min-h-screen flex-col items-center">
      <Title title={"Recipes"} />
      <div className="mb-5 text-3xl">Welcome to home of recipes</div>
      <div className="mt-5 flex flex-col gap-3">
        <Button>
          <Link href="/add">Add recipe</Link>
        </Button>
        <Button>
          <Link href="/find">Find</Link>
        </Button>
      </div>
    </main>
  );
}
