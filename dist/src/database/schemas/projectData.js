//projectData
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
export const projectData = pgTable("projectsSchema", {
    id: serial().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    ...timestamps,
}, t => [
    index("title_index").on(t.title),
]);
