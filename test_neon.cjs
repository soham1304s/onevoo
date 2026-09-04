const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable is required in .env or environment.');
  process.exit(1);
}
const sql = neon(dbUrl);

async function test() {
  try {
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, current_user as user_name;`;
    console.log('✅ Neon Database Connected Successfully!');
    console.log('Database Info:', result);
  } catch (err) {
    console.error('❌ Neon Connection Failed:', err);
  }
}

test();
