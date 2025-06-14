import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { timestamps } from "./helperColumns";
import { projects } from "./projects";

export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(() => projects.id),
  title: text(),
 link: text().notNull(),
  // is_active: boolean().default(true),
  description: text(),
  ...timestamps,
}, t => [
  index("repositories_project_name_idx").on(t.project_id),
  index("repositories_repository_name_idx").on(t.title),
]);


export type Repositories = typeof repositories.$inferSelect;
export type NewRepositories = typeof repositories.$inferInsert;
export type RepositoriesTable = typeof repositories;
