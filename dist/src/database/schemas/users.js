import { date, index, pgTable, serial, text, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "./helper-columns";
export const users = pgTable("users", {
    id: serial().primaryKey(),
    first_name: text().notNull(),
    last_name: text(),
    email: text().unique().notNull(),
    phone: text(),
    is_active: boolean().notNull().default(true),
    dob: date({ mode: "date" }).notNull(),
    doj: date({ mode: "date" }).notNull(),
    designation: text().notNull(),
    ...timestamps,
}, t => [
    index("users_email_idx").on(t.email),
    index("users_first_name_idx").on(t.first_name),
]);
