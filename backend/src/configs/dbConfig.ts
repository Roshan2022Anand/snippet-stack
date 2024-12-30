import { Pool } from "pg";
require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

// const sql = neon(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
