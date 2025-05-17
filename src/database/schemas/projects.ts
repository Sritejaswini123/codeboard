import { pgTable, serial, text, timestamp, index, integer } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
import { users } from "./users";

export const projects = pgTable("projects", {
    id: serial().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    assigned_to: integer().notNull().references(() => users.id),
    ...timestamps,
}, (t) => [
    index("title_idx").on(t.title),
    index("assigned_to_idx").on(t.assigned_to),
]);

export type ProjectsTable = typeof projects;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
