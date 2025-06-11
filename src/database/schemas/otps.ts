import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const otps = pgTable('otps', {
  id: serial('id').primaryKey(),
  target: varchar('target'), // email or phone
  otp: varchar('otp', { length: 6 }),
  used: boolean('used').default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})