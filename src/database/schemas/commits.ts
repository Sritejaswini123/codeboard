import { date, index, integer, pgTable, serial, text, time, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
export const commits = pgTable("commits", {
  id: serial().primaryKey(),
  date: date({ mode: "date" }).notNull(),
  time: time().notNull(),
  lines_of_code: integer().notNull(),
  commit_link: text().notNull(),
  commit_name: text().notNull(),
  ...timestamps,
}, t => [
  index("commits_date_idx").on(t.date),
]);
export type CommitsTable = typeof commits;
export type Commit = typeof commits.$inferSelect;
export type NewCommit = typeof commits.$inferInsert;
