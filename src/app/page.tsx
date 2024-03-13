import { unstable_noStore as noStore } from "next/cache";

import Link from "next/link";
import { Button } from "./_components/ui/button";
import { ParticleLogo } from "./_components/particle-logo";

import magnifyingGlassIcon from "~/assets/icons/magnifying-glass";
import plusIcon from "~/assets/icons/plus";

export default async function Home() {
  noStore();

  return (
    <main className="mb-8 flex min-h-screen flex-col items-center">
      <ParticleLogo title="Recipes" />
      <div className="mt-5 flex flex-col gap-3">
        <Button className="flex justify-start gap-3">
          {plusIcon}
          <Link href="/add">Add recipe</Link>
        </Button>
        <Button className="flex justify-start gap-3">
          {magnifyingGlassIcon}
          <Link href="/find">Find</Link>
        </Button>
      </div>
    </main>
  );
}
