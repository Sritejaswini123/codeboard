// commits
import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
import { user_projects } from "./userProjects";

export const commits = pgTable("commits", {
  id: serial().primaryKey(),
  user_project_id: integer().notNull().references(() => user_projects.id),
  lines_of_code: integer().notNull(),
  commit_link: text().notNull(),
  commit_name: text().notNull(),
  ...timestamps,
}, t => [
  index("commits_user_project_id_idx").on(t.user_project_id),
]);
export type Commit = typeof commits.$inferSelect;
export type NewCommit = typeof commits.$inferInsert;
export type CommitsTable = typeof commits;
