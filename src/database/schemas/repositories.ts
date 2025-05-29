// repositories.ts
import {  index, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { projects } from "./projects";
export const repositories = pgTable("repositories", {
  id: serial().primaryKey(),
  project_id: integer().notNull().references(() => projects.id),
  title: text().notNull(),
  description: text(),
  link: text().notNull()
}, t => [
  index("repositories__project_id_idx").on(t.project_id),
  index("repositories__title_idx").on(t.title),
]);
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type RepositoryTable = typeof repositories;