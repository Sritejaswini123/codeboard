import { boolean, date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const authUsers = pgTable("authUsers", {
  internalId: serial("internal_id").primaryKey(),  
 id: text("id").notNull().unique(),             
  first_name: text().notNull(),
  phone: text().unique(),
  is_active: boolean().notNull().default(true),
  dob: date({ mode: "date" }).notNull(),
  doj: date({ mode: "date" }).notNull(),
  designation: text().notNull(),
});



