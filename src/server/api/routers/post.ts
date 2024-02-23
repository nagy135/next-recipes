import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ingredient, recipe, usage } from "~/server/db/schema";

export const recipeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        userId: z.string(),
        ingredients: z
          .object({ name: z.string().min(1), amount: z.string().min(1) })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipeEntity = await ctx.db.insert(recipe).values({
        name: input.name,
        userId: input.userId,
        imagePath: "",
      });
      input.ingredients.map(async (e) => {
        const ingredientEntity = await ctx.db.insert(ingredient).values({
          name: e.name,
        });

        await ctx.db.insert(usage).values({
          recipeId: parseInt(recipeEntity.insertId),
          amount: e.amount,
          ingredientId: parseInt(ingredientEntity.insertId),
        });
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.recipe.findFirst({
      orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
    });
  }),
});
