const { Pool } = require('pg');
require('dotenv').config();

// Support both Supabase connection string and individual variables
let pool;

if (process.env.DATABASE_URL) {
  // Supabase connection string (recommended for production)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('📡 Using Supabase connection');
} else {
  // Local PostgreSQL or individual env vars
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  console.log('📡 Using local PostgreSQL connection');
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
