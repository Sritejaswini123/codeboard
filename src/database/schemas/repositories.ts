import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
import { projects } from "./projects";


export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_name: text().notNull(),
  repository_name: text(),
  repository_url: text().notNull()
}, t => [
  index("repositories__project_name_idx").on(t.project_name),
  index("repositories__repository_name_idx").on(t.repository_name),
]);
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoryTable = typeof repositories;

// export const repositories = pgTable("repositories", {
//   id: serial().primaryKey(),
//   project_name: text().notNull().references(() => projects.title),
//   repository_name: text(),
//   repository_url: text().notNull(),
//   ...timestamps,
// }, t => [
//   index("repositories_project_id_idx").on(t.id),
//   index("repositories_project_name").on(t.project_name),
//   index("repositories_repository_name").on(t.repository_name)
// ]);

// export type Repository = typeof repositories.$inferSelect;
// export type NewRepository = typeof repositories.$inferInsert;
// export type RepositoriesTable = typeof repositories;
