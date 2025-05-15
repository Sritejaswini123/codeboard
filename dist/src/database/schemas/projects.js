import { pgTable, serial, text, index, integer } from "drizzle-orm/pg-core";
import { timestamps } from "./helper-columns";
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
