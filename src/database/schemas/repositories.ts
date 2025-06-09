import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { projects } from "./projects";

export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(() => projects.id),
  title: text().notNull(),
  link: text().notNull(),
  description:text(),

}, t => [
  index("repositories_project_id_idx").on(t.project_id),
  index("repositories_title_idx").on(t.title),
]);

export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoriesTable = typeof repositories;