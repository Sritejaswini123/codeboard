import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import pg from "pg";
import env from "../env.js";
const { Pool } = pg;
const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync("./ca.pem").toString(),
    },
});
pool.query("select 2+4").then((res) => {
    console.log("db connected");
}).catch((err) => {
    console.log("Db connection failed");
});
const db = drizzle({ client: pool });
export default db;
