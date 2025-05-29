import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

import { timestamps } from "./helperColumns";
import { projects } from "./projects";
import { repositories } from "./repositories";
import { users } from "./users";

export const commits = pgTable(
  "commits",
  {
    id: serial().primaryKey(),
    month: text().notNull(),
    date: date({ mode: "date" }).notNull(),
    time: text().notNull(),
    user_id: integer().notNull().references(() => users.id),
    project_id: integer().notNull().references(() => projects.id),
    repository_id: integer().notNull().references(() => repositories.id),
    commit_message: text().notNull(),
    commit_link: text().notNull(),
    lines_of_code: integer().notNull(),
    ...timestamps,
  },
  t => [
    index("commits_commit_message_idx").on(t.commit_message),
    index("commits_user_id_idx").on(t.user_id),
    index("commits_project_id_idx").on(t.project_id),
    index("commits_repository_id_idx").on(t.repository_id),
    index("commits_date_idx").on(t.date),
  ],
);

export type Commit = typeof commits.$inferSelect;
export type NewCommit = typeof commits.$inferInsert;
export type CommitsTable = typeof commits;
