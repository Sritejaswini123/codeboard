import { boolean, date, pgTable, serial, text } from "drizzle-orm/pg-core";
export const authUsers = pgTable("authUsers", {
    internalId: serial("internal_id").primaryKey(), // Numeric auto-increment ID
    id: text("id").notNull().unique(), // Better Auth user ID (e.g., "user_clx...")
    first_name: text().notNull(),
    phone: text().unique(),
    is_active: boolean().notNull().default(true),
    dob: date({ mode: "date" }).notNull(),
    doj: date({ mode: "date" }).notNull(),
    designation: text().notNull(),
});
