import { boolean, date, index, pgTable, serial, text } from "drizzle-orm/pg-core";

import { timestamps } from "./helperColumns";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  first_name: text().notNull(),
  last_name: text(),
  email: text().unique().notNull(),
  phone: text(),
  is_active: boolean().default(true).notNull(),
  dob: date({ mode: "date" }).notNull(),
  doj: date({ mode: "date" }).notNull(),
  designation: text().notNull(),
  ...timestamps,
}, t => [
  index("users_email_idx").on(t.email),
  index("users_first_name_idx").on(t.first_name),
]);
export type UsersTable = typeof users;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
