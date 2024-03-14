import { z } from "zod";
import { groupBy } from "~/helpers/group-by";

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
        description: z.string().optional(),
        imagePath: z.string().optional(),
        ingredients: z
          .object({ name: z.string().min(1), amount: z.string().min(1) })
          .array().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipeEntity = await ctx.db.insert(recipe).values({
        name: input.name,
        userId: input.userId,
        description: input.description,
        imagePath: input.imagePath,
      });
      await Promise.all(
        input.ingredients.map(async (e) => {
          const ingredientEntity = await ctx.db.insert(ingredient).values({
            name: e.name,
          });

          await ctx.db.insert(usage).values({
            recipeId: parseInt(recipeEntity.insertId),
            amount: e.amount,
            ingredientId: parseInt(ingredientEntity.insertId),
          });
        }),
      );
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.recipe.findMany({
      orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
    });
  }),
  getAllWithIngredients: publicProcedure.query(async ({ ctx }) => {
    const usages = await ctx.db.query.usage.findMany({
      with: {
        recipe: true,
        ingredient: true,
      },
      orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
    });
    return groupBy(usages, "recipeId").map((e) => ({
      recipe: e[0]?.recipe,
      ingredients: e.map((e2) => ({ ...e2.ingredient, amount: e2.amount })),
    }));
  }),
});
