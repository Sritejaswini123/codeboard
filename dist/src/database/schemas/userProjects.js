//user_projects 
import { index, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { timestamps } from "./helperColumns";
import { users } from "./users";
export const user_projects = pgTable("user_projects", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => users.id),
    project_id: integer().notNull().references(() => projects.id),
    ...timestamps,
}, t => [
    index("user_projects_user_id_idx").on(t.user_id),
    index("user_projects_project_id_idx").on(t.project_id)
]);
