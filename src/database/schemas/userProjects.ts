//user_projects 
import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { timestamps } from "./helperColumns";
import { users } from "./users";

export const user_projects = pgTable("user_projects", {
  id : serial(),
  user_id: integer().notNull().references(() => users.id), 
  project_id: integer() .notNull().references(() => projects.id),
   ...timestamps,
}, t => [
  index("user_projects_user_id_idx").on(t.user_id),
  index("user_projects_project_id_idx").on(t.project_id)

]);
export type userProject = typeof user_projects.$inferSelect;
export type NewUserProject = typeof user_projects.$inferInsert;
export type userProjectsTable = typeof user_projects;
