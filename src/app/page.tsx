import { unstable_noStore as noStore } from "next/cache";

import Title from "./_components/title";
import Link from "next/link";
import { Button } from "./_components/ui/button";

export default async function Home() {
  noStore();

  return (
    <main className="mb-8 flex min-h-screen flex-col items-center">
      <Title title={"Recipes"} />
      <div className="flex flex-col gap-3">
        <Button>
          <Link href="/add">Add recipe</Link>
        </Button>
        <Button>
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </main>
  );
}
