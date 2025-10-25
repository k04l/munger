const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(5000, () => console.log('Server on 5000'));