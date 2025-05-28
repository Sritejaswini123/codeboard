// db/userProfile.ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url'),

  
});

