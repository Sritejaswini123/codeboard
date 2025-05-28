import { index, pgTable,integer, serial, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(( ) => projects.id ),
  repository_name: text(),
  repository_url: text().notNull(),
}, t => [
  index("repositories__project_name_idx").on(t.project_id),
  index("repositories__repository_name_idx").on(t.repository_name),
]);
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoryTable = typeof repositories;

