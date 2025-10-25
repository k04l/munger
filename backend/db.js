// backend/db.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
});

module.exports = { pool };