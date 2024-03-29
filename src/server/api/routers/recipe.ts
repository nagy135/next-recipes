import { and, inArray } from "drizzle-orm";
import { z } from "zod";
import { groupBy } from "~/helpers/group-by";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ingredient, recipe, usage } from "~/server/db/schema";

export const recipeRouter = createTRPCRouter({
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
  getOneWithIngredients: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.recipe.findFirst({
        where: (recipe, { eq }) => (eq(recipe.id, input.id)),
        with: {
          usage: {
            with: {
              ingredient: true
            }
          }
        }
      })
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

  getAllWithIngredientsByKeywords: publicProcedure
    .input(z.object({ keywords: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const usages = await ctx.db.query.usage.findMany({
        with: {
          recipe: true,
          ingredient: true,
        },
        where: input.keywords.length ? (usage, { or, inArray }) => or(
          inArray(
            usage.recipeId,
            ctx.db
              .select({ id: recipe.id })
              .from(recipe)
              .where(
                inArray(recipe.name, input.keywords),
              )
          ),
          inArray(
            usage.ingredientId,
            ctx.db
              .select({ id: ingredient.id })
              .from(ingredient)
              .where(
                inArray(ingredient.name, input.keywords),
              )
          ),
        ) : undefined,
        orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
      });
      return groupBy(usages, "recipeId").map((e) => ({
        recipe: e[0]?.recipe,
        ingredients: e.map((e2) => ({ ...e2.ingredient, amount: e2.amount })),
      }));
    }),
});
