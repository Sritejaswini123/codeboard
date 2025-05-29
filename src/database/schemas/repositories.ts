import { boolean, index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { projects } from "./projects";
import { timestamps } from "./helperColumns";

export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(() => projects.id),
  repository_name: text(),
  repository_url: text().notNull(),
  is_active: boolean().default(true),
  ...timestamps,
}, t => [
  index("repositories_project_name_idx").on(t.project_id),
  index("repositories_repository_name_idx").on(t.repository_name),
]);


export type Repositories = typeof repositories.$inferSelect;
export type NewRepositories = typeof repositories.$inferInsert;
export type RepositoriesTable = typeof repositories;
