import { unstable_noStore as noStore } from "next/cache";

import { Button } from "~/components/ui/button";

export default async function Home() {
  noStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Button>Haha</Button>
    </main>
  );
}
