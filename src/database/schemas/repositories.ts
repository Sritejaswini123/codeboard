// repositories.ts
import {  index, pgTable, serial, text } from "drizzle-orm/pg-core";
export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_name: text().notNull(),
  repository_name: text(),
  repository_link: text().notNull()
}, t => [
  index("repositories__project_name_idx").on(t.project_name),
  index("repositories__repository_name_idx").on(t.repository_name),
]);
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoryTable = typeof repositories;