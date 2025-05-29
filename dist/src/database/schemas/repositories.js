import { index, integer, pgTable, serial, boolean, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";
export const repositories = pgTable("repositories", {
    id: serial().primaryKey(),
    project_id: integer().notNull().references(() => projects.id),
    repository_name: text(),
    repository_url: text().notNull(),
    is_active: boolean().default(true)
}, t => [
    index("repositories_project_name_idx").on(t.project_id),
    index("repositories_repository_name_idx").on(t.repository_name),
]);
``;
