// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  text
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `recipes_${name}`);

export const recipe = createTable(
  "recipe",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: varchar("user_id", { length: 256 }).notNull(),

    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    imagePath: varchar("image_path", { length: 256 }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export type SelectRecipe = typeof recipe.$inferSelect;
export type InsertRecipe = typeof recipe.$inferInsert;

export const ingredient = createTable(
  "ingredient",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),

    name: varchar("name", { length: 256 }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export type SelectIngredient = typeof ingredient.$inferSelect;
export type InsertIngredient = typeof ingredient.$inferInsert;

export const usage = createTable("usage", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  recipeId: bigint("recipe_id", { mode: "number" }).notNull(),
  ingredientId: bigint("ingredient_id", { mode: "number" }).notNull(),

  amount: varchar("amount", { length: 256 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const usageRelations = relations(usage, ({ one }) => ({
  recipe: one(recipe, {
    fields: [usage.recipeId],
    references: [recipe.id],
  }),
  ingredient: one(ingredient, {
    fields: [usage.ingredientId],
    references: [ingredient.id],
  }),
}));
