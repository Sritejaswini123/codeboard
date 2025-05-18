//projects
import { index, pgTable, serial, text ,boolean } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  is_active: boolean().notNull().default(true),
  ...timestamps,
}, t => [
  index("projects_title_idx").on(t.title),
  index("projects_id_idx").on(t.id)
]);
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectsTable = typeof projects;