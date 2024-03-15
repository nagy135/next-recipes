import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipe } from "~/server/db/schema";

export const recipeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await ctx.db.insert(recipe).values({
        name: input.name,
        userId: "abc",
        imagePath: "",
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.recipe.findFirst({
      orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
    });
  }),
});
