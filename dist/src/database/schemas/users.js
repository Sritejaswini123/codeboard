import { boolean, date, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helperColumns";
export const users = pgTable("users", {
    id: serial().primaryKey(),
    first_name: text().notNull(),
    last_name: text(),
    email: text().unique().notNull(),
    phone: text().unique().notNull(),
    is_active: boolean().notNull().default(true),
    password: text().unique(),
    userProfileImage: text(),
    dob: date({ mode: "date" }).notNull(),
    doj: date({ mode: "date" }).notNull(),
    designation: text().notNull(),
    ...timestamps,
}, t => [
    index("users_email_idx").on(t.email),
    index("users_first_name_idx").on(t.first_name),
    index("users_phone_idx").on(t.phone),
    index("users_id_idx").on(t.id),
]);
