import { boolean, index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { projects } from "./projects";
import { timestamps } from "./helperColumns";

export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(() => projects.id),
  title: text(),
  repo_link: text().notNull(),
  description:text(),
  is_active: boolean().default(true),
  ...timestamps,
}, t => [
  index("repositories_project_id_idx").on(t.project_id),
  index("repositories_title_idx").on(t.title),
]);


export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoriesTable = typeof repositories;