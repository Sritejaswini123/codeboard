import { betterAuth } from "better-auth";
import { Pool } from "pg";
import fs from 'fs';

export const auth = betterAuth({
  database: new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync("./ca.pem").toString(),
    }
  }),
  emailAndPassword: {
     enabled: true 
  },
  
});
