<<<<<<< HEAD
//projects
import { index, pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
=======
import { boolean, index, pgTable, serial, text } from "drizzle-orm/pg-core";
>>>>>>> 455572aa48837731d32bec2487086e75434cd12a
import { timestamps } from "./helperColumns";
export const projects = pgTable("projects", {
    id: serial().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    is_active: boolean().notNull().default(true),
    ...timestamps,
}, t => [
    index("projects_title_idx").on(t.title),
    index("projects_id_idx").on(t.id),
]);
