
import {  pgTable, serial, text, timestamp, index,integer } from "drizzle-orm/pg-core";
import { timestamps } from "./helper-columns";

export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  assigned_to: integer().notNull(),
 ...timestamps,
}, (t) => [ 
  index("title_idx").on(t.title),
  index("assigned_to_idx").on(t.assigned_to),
]);

export type ProjectsTable = typeof projects;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;