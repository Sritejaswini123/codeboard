import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  deleted_at: timestamp(),
};
